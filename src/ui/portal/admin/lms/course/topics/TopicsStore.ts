import { action, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminTopicListReq } from "~/domain/lms/models/AdminTopicListReq";
import { AdminTopicItem } from "~/domain/lms/models/AdminTopicItem";
import { UpsertTopicReq } from "~/domain/lms/models/UpsertTopicReq";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { EasyTableData, EasyTableState } from "~/ui/components/easytable/types";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";
import { AdminTopicListVm } from "./models/AdminTopicListVm";
import { UpsertTopicDialog } from "./upserttopic/UpsertTopicDialog";
import { DeleteConfirmationDialog } from "~/ui/components/dialogs/DeleteConfirmationDialog";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";

const upsertTopicDialogId = "upsert-topic-dialog";

export class TopicsStore {
    layoutStore: CourseLayoutStore;
    dialogManager: DialogManagerStore;

    searchQuery: string = "";
    queryState: EasyTableState<AdminTopicItem> = EasyTableState.init<AdminTopicItem>();
    dataVmOpt: AdminTopicListVm | null = null;
    pageSize: number = 10;
    currentPage: number = 1;

    constructor({ layoutStore, dialogManager }: {
        layoutStore: CourseLayoutStore;
        dialogManager: DialogManagerStore;
    }) {
        this.layoutStore = layoutStore;
        this.dialogManager = dialogManager;

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

    openCreateTopicDialog() {
        this.dialogManager.show({
            id: upsertTopicDialogId,
            component: UpsertTopicDialog,
            props: {
                mode: "create",
                topicsStore: this,
                onClose: () => this.dialogManager.closeById(upsertTopicDialogId),
            },
        });
    }

    openEditTopicDialog(topic: AdminTopicItem) {
        this.dialogManager.show({
            id: upsertTopicDialogId,
            component: UpsertTopicDialog,
            props: {
                mode: "edit",
                topic,
                topicsStore: this,
                onClose: () => this.dialogManager.closeById(upsertTopicDialogId),
            },
        });
    }

    openDeleteTopicDialog(topic: AdminTopicItem) {
        this.dialogManager.show({
            id: "delete-topic-dialog",
            component: DeleteConfirmationDialog,
            props: {
                message: `Are you sure you want to delete the topic "${topic.name}"? This action cannot be undone.`,
                onConfirm: () => this.deleteTopic(topic.id),
                onCancel: () => this.dialogManager.closeById("delete-topic-dialog"),
            },
        });
    }

    async createTopic(name: string) {
        try {
            const req = new UpsertTopicReq({
                spaceId: this.courseId,
                name: name,
            });

            (await this.courseService.upsertTopic(req)).getOrError();

            showSuccessToast({
                message: "Topic created successfully",
            });

            this.reloadCurrentState();
        } catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
            throw error;
        }
    }

    async updateTopic(topicId: number, name: string) {
        try {
            const req = new UpsertTopicReq({
                spaceId: this.courseId,
                topicId: topicId,
                name: name,
            });

            (await this.courseService.upsertTopic(req)).getOrError();

            showSuccessToast({
                message: "Topic updated successfully",
            });

            this.reloadCurrentState();
        } catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
            throw error;
        }
    }

    async deleteTopic(topicId: number) {
        try {
            const res = (await this.courseService.deleteTopic(this.courseId, topicId)).getOrError();

            if (res.result) {
                showSuccessToast({
                    message: "Topic deleted successfully",
                });
                this.reloadCurrentState();
            } else {
                showErrorToast({
                    message: "Failed to delete topic",
                });
            }
        } catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
            throw error;
        }
    }
}