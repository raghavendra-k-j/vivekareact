import { action, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminTopicListReq } from "~/domain/lms/models/AdminTopicListReq";
import { AdminTopicItem } from "~/domain/lms/models/AdminTopicItem";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { EasyTableData, EasyTableState } from "~/ui/components/easytable/types";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";
import { AdminTopicListVm } from "./models/AdminTopicListVm";
import { TopicDialogStore } from "./TopicDialogStore";

export class TopicsStore {
    layoutStore: CourseLayoutStore;

    searchQuery: string = "";
    queryState: EasyTableState<AdminTopicItem> = EasyTableState.init<AdminTopicItem>();
    dataVmOpt: AdminTopicListVm | null = null;
    pageSize: number = 10;
    currentPage: number = 1;

    topicDialogStore: TopicDialogStore;

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
        this.layoutStore = layoutStore;
        this.topicDialogStore = new TopicDialogStore({ topicsStore: this });

        makeObservable(this, {
            queryState: observable.ref,
            dataVmOpt: observable.ref,
            searchQuery: observable,
            currentPage: observable,
            pageSize: observable,
            updateSearchQuery: action,
            changePage: action,
            changePageSize: action,
        });
    }

    get courseService(): AdminCourseService {
        return this.layoutStore.courseService;
    }

    get listVm(): AdminTopicListVm {
        return this.dataVmOpt!;
    }

    get courseId(): number {
        return this.layoutStore.course.id;
    }

    updateSearchQuery(query: string) {
        this.searchQuery = query;
    }

    changePage(page: number) {
        this.currentPage = page;
        this.loadTopics({ page: page });
    }

    changePageSize(size: number) {
        this.pageSize = size;
        this.currentPage = 1;
        this.loadTopics({ page: 1 });
    }

    async loadTopics({ page = 1 }: { page?: number } = {}) {
        console.log("TopicsStore: loadTopics", { page });
        try {
            runInAction(() => {
                this.queryState = EasyTableState.loading();
                this.currentPage = page;
            });

            const req = new AdminTopicListReq({
                spaceId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery || null,
            });

            const res = (await withMinDelay(this.courseService.queryTopics(req), 300)).getOrError();
            const vm = AdminTopicListVm.fromModel(res);
            runInAction(() => {
                this.dataVmOpt = vm;
                const tableData = new EasyTableData({
                    items: vm.items,
                    currentPage: vm.pageInfo.page,
                    pageSize: vm.pageInfo.pageSize,
                    totalItems: vm.pageInfo.totalItems,
                });
                this.queryState = EasyTableState.data(tableData);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.queryState = EasyTableState.error(appError);
            });
        }
    }

    reloadCurrentState(): void {
        this.loadTopics({ page: this.currentPage });
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.loadTopics({ page: 1 });
    }

    goToPage(page: number) {
        this.loadTopics({ page });
    }
}