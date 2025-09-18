import { action, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { AdminQueryFormsReq, AdminQueryFormsRes } from "~/domain/forms/admin/models/AdminQueryFormsModels";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { FormType } from "~/domain/forms/models/FormType";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { DataState } from "~/ui/utils/DataState";
import { AdminFormsLayoutStore } from "../layout/AdminFormsLayoutStore";

export class AdminFormsListStore {
    layoutStore: AdminFormsLayoutStore;

    searchQuery: string = "";
    queryState: DataState<AdminQueryFormsRes> = DataState.init();
    pageSize: number = 50;
    currentPage: number = 1;
    selectedFormType: FormType | null = null;
    selectedAdminFormStatus: AdminFormStatus | null = null;

    private debouncedLoadForms: () => void;

    constructor({ layoutStore }: { layoutStore: AdminFormsLayoutStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            queryState: observable.ref,
            searchQuery: observable,
            currentPage: observable,
            selectedFormType: observable,
            selectedAdminFormStatus: observable,
            setSearchQuery: action,
            setSelectedFormType: action,
            setSelectedAdminFormStatus: action,
        });
        this.debouncedLoadForms = createSearchDebounce(() => this.loadForms({ page: 1 })).invoke;
    }

    get listVm(): AdminQueryFormsRes {
        return this.queryState.data!;
    }

    async loadForms({ page = 1 }: { page?: number } = {}) {
        try {
            runInAction(() => {
                this.queryState = DataState.loading();
                this.currentPage = page;
            });

            const req = new AdminQueryFormsReq({
                formType: this.selectedFormType,
                adminFormStatus: this.selectedAdminFormStatus,
                categoryIds: null,
                searchQuery: this.searchQuery,
                page: page,
                pageSize: this.pageSize,
            });

            const res = (await withMinDelay(this.layoutStore.formsService.queryForms(req), 300)).getOrError();

            runInAction(() => {
                this.queryState = DataState.data(res);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.queryState = DataState.error(appError);
            });
        }
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.debouncedLoadForms();
    }

    setSelectedFormType(formType: FormType | null) {
        this.selectedFormType = formType;
        this.loadForms({ page: 1 });
    }

    setSelectedAdminFormStatus(adminFormStatus: AdminFormStatus | null) {
        this.selectedAdminFormStatus = adminFormStatus;
        this.loadForms({ page: 1 });
    }

    goToPage(page: number) {
        if (page < 1 || (this.queryState.isData && page > this.listVm.pageInfo.totalPages)) {
            return;
        }
        this.loadForms({ page });
    }
}