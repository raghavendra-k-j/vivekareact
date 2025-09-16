import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCCListReq } from "~/domain/lms/models/AdminQueryCCModels";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { AdminCCListVm } from "./models/AdminCCListVm";
import { CoursePageStore } from "../CoursePageStore";

export class ContentStore {
    layoutStore: CoursePageStore;

    searchQuery: string = "";
    queryState: DataState<AdminCCListVm> = DataState.init();
    pageSize: number = 50;
    currentPage: number = 1;

    constructor({ layoutStore }: { layoutStore: CoursePageStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            queryState: observable.ref,
            searchQuery: observable,
            currentPage: observable,
        });
    }

    get adminSpacesService(): AdminSpacesService {
        return this.layoutStore.layoutStore.adminSpacesService;
    }

    get listVm(): AdminCCListVm {
        return this.queryState.data!;
    }

    // This will need to be set from the component using URL params
    private _courseId: number | null = null;

    setCourseId(courseId: number) {
        this._courseId = courseId;
    }

    get courseId(): number | null {
        return this._courseId;
    }

    async loadContents({ page = 1 }: { page?: number } = {}) {
        if (!this.courseId) return;

        try {
            runInAction(() => {
                this.queryState = DataState.loading();
                this.currentPage = page;
            });

            const req = new AdminCCListReq({
                courseId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery || null,
                formType: null,
                formStatus: null,
                topicIds: null,
            });

            const res = (await withMinDelay(this.adminSpacesService.queryCourseContents(req), 300)).getOrError();
            const vm = AdminCCListVm.fromModel(res);

            runInAction(() => {
                this.queryState = DataState.data(vm);
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
        this.loadContents({ page: 1 });
    }

    goToPage(page: number) {
        this.loadContents({ page });
    }
}