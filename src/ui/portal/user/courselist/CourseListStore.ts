import { action, makeObservable, observable, runInAction } from "mobx";
import { HomePageStore } from "../home/HomePageStore";
import { DataState } from "~/ui/utils/DataState";
import { CourseListVm } from "./models/CourseListVm";
import { CourseListingReq } from "~/domain/userapp/models/CourseListingModels";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { withMinDelay } from "~/infra/utils/withMinDelay";

export interface CourseListStoreProps {
    homeStore: HomePageStore;
}

export class CourseListStore {


    homeStore: HomePageStore;
    loadedCurrentPage: number = 1;
    pageSize: number = 100;
    searchQuery: string = "";
    loadState: DataState<CourseListVm> = DataState.init();
    selectedStatus: CourseStatus | null = null;

    private searchDebounce = createSearchDebounce(() => {
        this.loadCourses({ page: 1 });
    });

    constructor(props: CourseListStoreProps) {
        this.homeStore = props.homeStore;
        this.selectedStatus = CourseStatus.ACTIVE;
        makeObservable(this, {
            loadedCurrentPage: observable,
            loadState: observable.ref,
            searchQuery: observable,
            selectedStatus: observable.ref,
            updateSearchQuery: action,
            updateSelectedStatus: action,
        });
    }

    get coursesVm() {
        return this.loadState.data!;
    }

    get courses() {
        return this.coursesVm.items;
    }

    get coursesService() {
        return this.homeStore.userPortal.coursesService!;
    }

    updateSearchQuery(query: string) {
        this.searchQuery = query;
        this.searchDebounce.invoke();
    }

    updateSelectedStatus(selectedStatus: CourseStatus | null): void {
        this.selectedStatus = selectedStatus;
        this.loadCourses({ page: 1 });
    }

    onClickJoinCourse(): void {

    }


    async loadCourses({ page = 1 }: { page?: number } = {}) {
        try {
            const searchQuery = this.searchQuery.trim() === "" ? null : this.searchQuery.trim();
            runInAction(() => {
                this.loadState = DataState.loading();
            });
            const req = new CourseListingReq({
                status: this.selectedStatus,
                page: page,
                pageSize: this.pageSize,
                searchQuery: searchQuery
            });
            const res = await withMinDelay(this.coursesService.queryMyCourses(req).then(r => r.getOrError()), 300);
            const vm = CourseListVm.fromModel(res);
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

}