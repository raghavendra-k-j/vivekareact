import { action, makeObservable, observable } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { UpsertTopicReq } from "~/domain/lms/models/UpsertTopicReq";
import { AdminTopicItem } from "~/domain/lms/models/AdminTopicItem";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { TopicsStore } from "./TopicsStore";
import { topicDialogId } from "./utils";
import TopicDialog from "./components/TopicDialog";

export class TopicDialogStore {
    topicsStore: TopicsStore;

    // Dialog state
    isEdit: boolean = false;
    editingTopic: AdminTopicItem | null = null;

    // Form state
    topicName: string = "";
    selectedAvatarColor: AvatarColor | null = null;

    constructor({ topicsStore }: { topicsStore: TopicsStore }) {
        this.topicsStore = topicsStore;

        makeObservable(this, {
            isEdit: observable,
            editingTopic: observable,
            topicName: observable,
            selectedAvatarColor: observable,
            setTopicName: action,
            setSelectedAvatarColor: action,
            openCreateDialog: action,
            openEditDialog: action,
        });
    }

    get layoutStore() {
        return this.topicsStore.layoutStore;
    }

    get courseService() {
        return this.topicsStore.courseService;
    }

    get courseId(): number {
        return this.topicsStore.courseId;
    }

    setTopicName(name: string) {
        this.topicName = name;
    }

    setSelectedAvatarColor(color: AvatarColor | null) {
        this.selectedAvatarColor = color;
    }

    openCreateDialog() {
        this.isEdit = false;
        this.editingTopic = null;
        this.topicName = "";
        this.selectedAvatarColor = null;
        this.layoutStore.dialogManager.show({
            id: topicDialogId,
            component: TopicDialog,
            props: {
                dialogStore: this,
            },
        });
    }

    openEditDialog(topic: AdminTopicItem) {
        this.isEdit = true;
        this.editingTopic = topic;
        this.topicName = topic.name;
        this.selectedAvatarColor = topic.avatarColor;
        this.layoutStore.dialogManager.show({
            id: topicDialogId,
            component: TopicDialog,
            props: {
                dialogStore: this,
            },
        });
    }

    closeDialog(): void {
        this.layoutStore.dialogManager.closeById(topicDialogId);
    }

    async createTopic() {
        if (!this.topicName.trim() || !this.selectedAvatarColor) {
            showErrorToast({
                message: "Please fill in all required fields",
            });
            return;
        }

        try {
            const req = new UpsertTopicReq({
                spaceId: this.courseId,
                name: this.topicName.trim(),
                avatarColor: this.selectedAvatarColor,
            });

            (await this.courseService.upsertTopic(req)).getOrError();

            showSuccessToast({
                message: "Topic created successfully",
            });

            this.closeDialog();
            this.topicsStore.reloadCurrentState();
        } catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }

    async updateTopic() {
        if (!this.editingTopic || !this.topicName.trim() || !this.selectedAvatarColor) {
            showErrorToast({
                message: "Please fill in all required fields",
            });
            return;
        }

        try {
            const req = new UpsertTopicReq({
                spaceId: this.courseId,
                topicId: this.editingTopic.id,
                name: this.topicName.trim(),
                avatarColor: this.selectedAvatarColor,
            });

            (await this.courseService.upsertTopic(req)).getOrError();

            showSuccessToast({
                message: "Topic updated successfully",
            });

            this.closeDialog();
            this.topicsStore.reloadCurrentState();
        } catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }

    async submit() {
        if (this.isEdit) {
            await this.updateTopic();
        } else {
            await this.createTopic();
        }
    }

    async deleteTopic(topicId: number) {
        if (!confirm("Are you sure you want to delete this topic?")) {
            return;
        }

        try {
            const res = (await this.courseService.deleteTopic(this.courseId, topicId)).getOrError();

            if (res.result) {
                showSuccessToast({
                    message: "Topic deleted successfully",
                });
                this.topicsStore.reloadCurrentState();
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
        }
    }
}