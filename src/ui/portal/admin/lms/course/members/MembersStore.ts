import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { RemoveMembersReq } from "~/domain/lms/models/AddRemoveMembersModels";
import { AdminCMListReq } from "~/domain/lms/models/AdminCMListModels";
import { SpaceMemberRole } from "~/domain/lms/models/SpaceMemberRole";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { showLoadingDialog } from "~/ui/components/dialogs/showLoadingDialog";
import { DataState } from "~/ui/utils/DataState";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import AddMembersDialog from "../addmembers/AddMembersDialog";
import { addMembersDialogId } from "../addmembers/utils";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";
import { AdminCMListVm } from "./models/AdminCMListVm";

export class MembersStore {
    layoutStore: CourseLayoutStore;

    searchQuery: string = "";
    queryState: DataState<AdminCMListVm> = DataState.init();
    pageSize: number = 50;
    selectedRole: SpaceMemberRole | null = null;

    private debouncedLoadMembers: () => void;
    selectedItems: Set<number> = new Set();

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            queryState: observable.ref,
            searchQuery: observable,
            selectedRole: observable,
            selectedItems: observable.shallow,
            clearSelection: action,
            setSearchQuery: action,
            listVm: computed,
            setSelectedRole: action,
            toggleSelectAll: action,
            toggleSelectItem: action,
        });
        this.debouncedLoadMembers = createSearchDebounce(() => this.loadMembers({ page: 1 })).invoke;
    }

    get courseService() {
        return this.layoutStore.courseService;
    }

    get listVm(): AdminCMListVm {
        return this.queryState.data!;
    }

    get courseId(): number {
        return this.layoutStore.courseId;
    }

    async loadMembers({ page = 1 }: { page?: number } = {}) {
        try {
            runInAction(() => {
                this.queryState = DataState.loading();
            });
            const req = new AdminCMListReq({
                courseId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery,
                memberRole: this.selectedRole,
            });
            const res = (await withMinDelay(this.courseService.queryMembers(req), 300)).getOrError();
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
        this.debouncedLoadMembers();
    }

    goToPage(page: number) {
        if (page < 1 || (this.queryState.isData && page > this.listVm.pageInfo.totalPages)) {
            return;
        }
        this.loadMembers({ page });
    }

    setSelectedRole(role: SpaceMemberRole | null) {
        this.selectedRole = role;
        this.loadMembers({ page: 1 });
    }


    showAddMembersDialog() {
        this.layoutStore.dialogManager.show({
            id: addMembersDialogId,
            component: AddMembersDialog,
            props: {
                membersStore: this,
            },
        });
    }

    clearSelection() {
        this.selectedItems.clear();
    }

    toggleSelectItem(id: number) {
        if (this.selectedItems.has(id)) {
            this.selectedItems.delete(id);
        }
        else {
            this.selectedItems.add(id);
        }
    }

    toggleSelectAll() {
        if (this.selectedItems.size === this.listVm.items.length) {
            this.clearSelection();
        } else {
            this.listVm.items.forEach(item => this.selectedItems.add(item.id));
        }
    }

    async removeSelectedItems() {
        const dialogId = "removing-members-dialog";
        try {
            showLoadingDialog({
                dialogManager: this.layoutStore.dialogManager,
                dialogId: dialogId,
                message: "Removing..."
            });
            const userIds = Array.from(this.selectedItems);
            const req = new RemoveMembersReq({
                courseId: this.courseId,
                userIds: userIds,
            });
            (await this.courseService.removeMembers(req)).getOrError();
            runInAction(() => {
                this.clearSelection();
            });
            this.loadMembers({ page: 1 });
            showSuccessToast({
                message: "Removed successfully"
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description
            });
        }
        finally {
            this.layoutStore.dialogManager.closeById(dialogId);
        }
    }

}