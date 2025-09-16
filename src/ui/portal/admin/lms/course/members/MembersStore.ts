import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCMListReq } from "~/domain/lms/models/AdminCMListModels";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { AdminCMListVm } from "./models/AdminCMListVm";
import { CoursePageStore } from "../CoursePageStore";

export class MembersStore {
    layoutStore: CoursePageStore;

    searchQuery: string = "";
    queryState: DataState<AdminCMListVm> = DataState.init();
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

    get listVm(): AdminCMListVm {
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

    async loadMembers({ page = 1 }: { page?: number } = {}) {
        if (!this.courseId) return;

        try {
            runInAction(() => {
                this.queryState = DataState.loading();
                this.currentPage = page;
            });

            const req = new AdminCMListReq({
                courseId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery || null,
                memberRole: null,
            });

            const res = (await withMinDelay(this.adminSpacesService.queryMembers(req), 300)).getOrError();
            const vm = AdminCMListVm.fromModel(res);

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
        this.loadMembers({ page: 1 });
    }

    goToPage(page: number) {
        this.loadMembers({ page });
    }
}