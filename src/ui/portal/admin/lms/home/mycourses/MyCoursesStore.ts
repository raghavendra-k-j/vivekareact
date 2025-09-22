import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminQueryMyCoursesReq } from "~/domain/lms/models/AdminMyCoursesListingModels";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { EasyTableData, EasyTableState } from "~/ui/components/easytable/types";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AdminMyCoursesListVm } from "./models/AdminMyCoursesListVm";
import { withMinDelay } from "~/infra/utils/withMinDelay";

export class AdminMyCoursesStore {
    dialogManager: DialogManagerStore;
    layoutStore: LMSLayoutStore;
    navigate: (path: string) => void;

    searchQuery: string = "";
    queryState: EasyTableState<AdminMyCoursesListVm['items'][0]> = EasyTableState.init();
    pageSize: number = 50;
    currentPage: number = 1;
    selectedStatus: CourseStatus | null = null;

    constructor({
        layoutStore,
        dialogManager,
        navigate
    }: {
        layoutStore: LMSLayoutStore,
        dialogManager: DialogManagerStore,
        navigate: (path: string) => void
    }) {
        this.layoutStore = layoutStore;
        this.dialogManager = dialogManager;
        this.navigate = navigate;
        makeObservable(this, {
            queryState: observable.ref,
            searchQuery: observable,
            selectedStatus: observable,
            currentPage: observable,
            pageSize: observable,
        });
    }

    get adminCourseService(): AdminCourseService {
        return this.layoutStore.adminCourseService;
    }

    async loadItems({ page = 1 }: { page?: number } = {}) {
        try {
            runInAction(() => {
                this.queryState = EasyTableState.loading();
                this.currentPage = page;
            });
            const req = new AdminQueryMyCoursesReq({
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery || null,
                courseStatus: this.selectedStatus
            });
            const res = (await withMinDelay(this.adminCourseService.queryMyCourses(req), 300)).getOrError();
            const vm = AdminMyCoursesListVm.fromModel(res);
            runInAction(() => {
                const tableData = new EasyTableData({
                    items: vm.items,
                    currentPage: vm.pageInfo.page,
                    pageSize: vm.pageInfo.pageSize,
                    totalItems: vm.pageInfo.totalItems,
                });
                this.queryState = EasyTableState.data(tableData);
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.queryState = EasyTableState.error(appError);
            });
        }
    }

    navigateToCourse(id: number) {
        this.navigate(`/console/lms/courses/${id}/content`);
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.loadItems({ page: 1 });
    }

    setSelectedStatus(status: CourseStatus | null) {
        this.selectedStatus = status;
        this.loadItems({ page: 1 });
    }

    changePage(page: number) {
        this.currentPage = page;
        this.loadItems({ page });
    }

    changePageSize(size: number) {
        this.pageSize = size;
        this.currentPage = 1;
        this.loadItems({ page: 1 });
    }

    reloadCurrentState() {
        this.loadItems({ page: this.currentPage });
    }
}