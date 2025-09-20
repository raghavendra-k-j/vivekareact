import { action, makeObservable, observable, runInAction } from "mobx";
import { HomePageStore } from "../home/HomePageStore";
import { DataState } from "~/ui/utils/DataState";
import { FormsListVm } from "./models/FormsListVm";
import { FormListingReq } from "~/domain/forms/models/FormListingModels";
import { UserFormStatus } from "~/domain/forms/models/UserFormStatus";
import { FormType } from "~/domain/forms/models/FormType";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { withMinDelay } from "~/infra/utils/withMinDelay";

export interface FormsListStoreProps {
    formType: FormType;
    homeStore: HomePageStore;
}

export class FormsListStore {
    formType: FormType;
    homeStore: HomePageStore;
    loadedCurrentPage: number = 1;
    pageSize: number = 100;
    searchQuery: string = "";
    loadState: DataState<FormsListVm> = DataState.init();
    selectedStatus: UserFormStatus | null = null;

    private searchDebounce = createSearchDebounce(() => {
        this.loadForms({ page: 1 });
    });

    constructor(props: FormsListStoreProps) {
        this.homeStore = props.homeStore;
        this.formType = props.formType;
        makeObservable(this, {
            loadedCurrentPage: observable,
            loadState: observable.ref,
            searchQuery: observable,
            selectedStatus: observable.ref,
            updateSearchQuery: action,
            updateSelectedStatus: action,
        });
    }

    get formsVm() {
        return this.loadState.data!;
    }

    get forms() {
        return this.formsVm.items;
    }

    get formsService() {
        return this.homeStore.userPortal.formsService!;
    }

    updateSearchQuery(query: string) {
        this.searchQuery = query;
        this.searchDebounce.invoke();
    }

    updateSelectedStatus(selectedStatus: UserFormStatus | null): void {
        this.selectedStatus = selectedStatus;
        this.loadForms({ page: 1 });
    }

    async loadForms({ page = 1 }: { page?: number } = {}) {
        try {
            const searchQuery = this.searchQuery.trim() === "" ? null : this.searchQuery.trim();
            runInAction(() => {
                this.loadState = DataState.loading();
            });
            const req = new FormListingReq({
                searchQuery: searchQuery,
                status: this.selectedStatus,
                page: page,
                pageSize: this.pageSize,
                formType: this.formType
            });
            const res = await withMinDelay(this.formsService.getFormList(req).then(r => r.getOrError()), 300);
            const vm = FormsListVm.fromModel(res);
            runInAction(() => {
                this.loadedCurrentPage = page;
                this.loadState = DataState.data(vm);
            });
        }
        catch (err) {
            const appError = AppError.fromAny(err);
            runInAction(() => {
                this.loadState = DataState.error(appError);
            });
        }
    }

    get userPortal() {
        return this.homeStore.userPortal;
    }

}