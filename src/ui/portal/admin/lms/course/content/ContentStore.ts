import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCCListReq } from "~/domain/lms/models/AdminQueryCCModels";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { AdminCCListVm } from "./models/AdminCCListVm";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";

export class ContentStore {
    layoutStore: CourseLayoutStore;

    searchQuery: string = "";
    queryState: DataState<AdminCCListVm> = DataState.init();
    pageSize: number = 50;
    currentPage: number = 1;

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
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

    get courseId(): number {
        return this.layoutStore.courseId;
    }

    async loadContents({ page = 1 }: { page?: number } = {}) {
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