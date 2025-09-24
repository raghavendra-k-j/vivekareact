import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { FormListingReq } from "~/domain/forms/models/FormListingModels";
import { UserFormStatus } from "~/domain/forms/models/UserFormStatus";
import { DataState } from "~/ui/utils/DataState";
import { FormsListVm } from "../formslist/models/FormsListVm";
import { CourseDetailStore } from "./CourseDetailStore";


export class CourseContentsStore {
    parentStore: CourseDetailStore;
    searchQuery: string = "";
    pageSize: number = 10;
    queryState: DataState<FormsListVm> = DataState.init();
    selectedStatusFilter: UserFormStatus | null = null;
    currentPage: number = 1;

    private searchDebounce = createSearchDebounce(() => {
        this.loadContents({ page: 1 });
    });

    constructor({ parentStore }: { parentStore: CourseDetailStore }) {
        this.parentStore = parentStore;
        makeObservable(this, {
            searchQuery: observable,
            pageSize: observable,
            currentPage: observable,
            queryState: observable.ref,
            selectedStatusFilter: observable.ref,
        });
    }

    changePageSize(size: number) {
        this.pageSize = size;
        this.currentPage = 1;
        this.loadContents({ page: 1 });
    }

    changePage(page: number) {
        this.currentPage = page;
        this.loadContents({ page: page });
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.currentPage = 1;
        this.searchDebounce.invoke();
    }

    get listVm() {
        return this.queryState.data!;
    }

    get items() {
        return this.listVm.items;
    }

    get pageInfo() {
        return this.listVm.pageInfo;
    }


    async loadContents({ page = 1 }: { page?: number }) {
        try {
            runInAction(() => {
                this.queryState = DataState.loading();
            });
            const req = new FormListingReq({
                searchQuery: this.searchQuery.trim(),
                status: this.selectedStatusFilter,
                page: page,
                pageSize: this.pageSize,
                formType: null,
                spaceId: null,
                // spaceId: this.parentStore.courseVm.id,
                topicId: null,
            });
            const res = (await this.parentStore.userPortalStore.formsService.getFormList(req)).getOrError();
            const vm = FormsListVm.fromModel(res);
            runInAction(() => {
                this.queryState = DataState.data(vm);
            });
        }
        catch (err) {
            console.error("Error loading contents", err);
            const appError = AppError.fromAny(err);
            runInAction(() => {
                this.queryState = DataState.error(appError);
            });
        }
    }

}