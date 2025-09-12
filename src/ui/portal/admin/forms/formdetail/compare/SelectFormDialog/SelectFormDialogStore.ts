import { action, makeObservable, observable, reaction, runInAction } from "mobx";
import { AdminFormCompareStore } from "../ComparePageStore";
import { DataState } from "~/ui/utils/DataState";
import { QueryFormsToCompareResVm } from "../models/QueryFormsToCompareResVm";
import { FormCompareItemVm } from "../models/FormCompareItemVm";
import { QueryFormsToCompareReq } from "~/domain/forms/admin/models/compare/QueryFormsToCompareReq";
import { AppError } from "~/core/error/AppError";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { FormCompareDetailsVm } from "../models/FormCompareDetailsVm";
import { createContext, useContext } from "react";
import { logger } from "~/core/utils/logger";
import { createSearchDebounce } from "~/core/utils/searchDebouce";

export const SelectFormDialogContext = createContext<SelectFormDialogStore | null>(null);

export function useSelectFormDialogStore() {
    const store = useContext(SelectFormDialogContext);
    if (!store) {
        throw new Error("SelectFormDialogStore not found in context");
    }
    return store;
}

export type SelectFormDialogStoreProps = {
    parentStore: AdminFormCompareStore;
    onClose: () => void;
}

export class SelectFormDialogStore {

    parentStore: AdminFormCompareStore;
    loadState: DataState<QueryFormsToCompareResVm> = DataState.init();
    searchQuery: string = "";
    currentPage: number = 1;
    selectedForm: FormCompareItemVm | null = null;
    pageSize: number = 10;
    onClose: () => void;

    private searchDebounce: { invoke: (...args: any[]) => void; cancel: () => void };

    constructor(params: SelectFormDialogStoreProps) {
        this.parentStore = params.parentStore;
        this.loadState = DataState.init();
        this.onClose = params.onClose;

        makeObservable(this, {
            loadState: observable.ref,
            searchQuery: observable,
            currentPage: observable,
            selectedForm: observable.ref,
            onSearchQueryChange: action,
        });

        this.searchDebounce = createSearchDebounce(() => {
            this.loadData(1);
        });

        reaction(
            () => this.searchQuery,
            () => {
                this.searchDebounce.invoke();
            }
        );
    }

    get data() {
        return this.loadState.data!;
    }

    onSearchQueryChange(query: string) {
        this.searchQuery = query;
    }

    get isPaginationRequired() {
        return this.data.pageInfo.totalPages > 1;
    }

    async loadData(page = this.currentPage) {
        try {
            runInAction(() => (this.loadState = DataState.loading()));

            const req = new QueryFormsToCompareReq({
                formId: this.parentStore.parentStore.fd.id,
                searchQuery: this.searchQuery,
                assessmentType: null,
                page: page,
                pageSize: this.pageSize,
            });

            const response = await this.parentStore.parentStore.adminFormService.queryFormsToCompare(req);

            const data = response.getOrError();
            const vm = QueryFormsToCompareResVm.fromModel(data);
            runInAction(() => {
                this.loadState = DataState.data(vm);
                this.currentPage = page;
            });
        }
        catch (error) {
            logger.error("Error loading forms to compare", error);
            const e = AppError.fromAny(error);
            runInAction(() => (this.loadState = DataState.error(e)));
        }
    }



    goToPage(page: number) {
        if (page !== this.currentPage) {
            this.loadData(page);
        }
    }

    async onFormSelected(item: FormCompareItemVm): Promise<void> {
        if (this.selectedForm === item) {
            if (item.detailState.isError && item.detailState.error) {
                showErrorToast({
                    message: item.detailState.error.message,
                    description: item.detailState.error.description,
                });
            }
            return;
        }

        this.selectedForm = item;

        try {
            runInAction(() => item.detailState = DataState.loading());
            const data = (await this.parentStore.fetchFormCompareDetails({ formAId: this.parentStore.parentStore.fd.id, formBId: item.item.id, restrictAutoOrganize: false })).getOrError();
            runInAction(() => item.detailState = DataState.data(data));
            this.parentStore.onFormSelectedFromDialog(new FormCompareDetailsVm(data));
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => item.detailState = DataState.error(appError));
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }
}
