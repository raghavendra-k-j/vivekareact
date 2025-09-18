import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { UserRoleType } from "~/domain/common/models/UserRoleType";
import { QueryAddMembersReq } from "~/domain/lms/models/QueryAddMembersModels";
import { DataState } from "~/ui/utils/DataState";
import { MembersStore } from "../members/MembersStore";
import { QueryMembersVm } from "./QueryMembersVm";
import { addMembersDialogId } from "./utils";
import { AddMembersReq } from "~/domain/lms/models/AddRemoveMembersModels";
import { showSuccessToast } from "~/ui/widgets/toast/toast";

export class AddMembersDialogStore {

    membersStore: MembersStore;

    searchText: string = "";
    selectedIds: Set<number> = new Set();
    selectedRoleType: UserRoleType | null = null;
    loadUsersState: DataState<QueryMembersVm> = DataState.init();
    addState: DataState<void> = DataState.init();
    private pageSize: number = 100;

    constructor({ membersPageStore }: { membersPageStore: MembersStore }) {
        this.membersStore = membersPageStore;

        const searchDebouce = createSearchDebounce(() => {
            this.loadUsers({ page: 1 });
        });

        makeObservable(this, {
            searchText: observable,
            selectedIds: observable.shallow,
            selectedRoleType: observable,
            loadUsersState: observable.ref,
            addState: observable.ref,
            setSearchText: action,
            canEnableAddButton: computed,
            selectedUsersCount: computed,
            hasSelectedUsers: computed,
            resetSearchAndFilters: action,
            setSelectedRoleType: action,
            clearSelection: action,
        });

        reaction(
            () => this.searchText,
            () => searchDebouce.invoke()
        );
    }

    get listVm() {
        return this.loadUsersState.data!;
    }

    get layoutStore() {
        return this.membersStore.layoutStore;
    }

    get adminCourseService() {
        return this.layoutStore.courseService;;
    }

    get courseId() {
        return this.membersStore.courseId;
    }

    get canEnableAddButton(): boolean {
        return this.selectedIds.size > 0 && !this.addState.isLoading;
    }

    get hasSelectedUsers(): boolean {
        return this.selectedIds.size > 0;
    }

    get selectedUsersCount(): number {
        return this.selectedIds.size;
    }

    resetSearchAndFilters() {
        this.searchText = "";
        this.selectedRoleType = null;
        this.loadUsers({ page: 1 });
    }

    clearSelection() {
        this.selectedIds.clear();
    }

    setSearchText(text: string) {
        this.searchText = text;
    }

    setSelectedRoleType(roleType: UserRoleType | null) {
        this.selectedRoleType = roleType;
        this.loadUsers({ page: 1 });
    }

    toggleUserSelection(userId: number) {
        if (this.selectedIds.has(userId)) {
            this.selectedIds.delete(userId);
        } else {
            this.selectedIds.add(userId);
        }
    }

    async addMembers() {
        if (!this.canEnableAddButton) return;
        runInAction(() => {
            this.addState = DataState.loading();
        });
        try {
            const addMembersReq = new AddMembersReq({
                courseId: this.courseId,
                userIds: Array.from(this.selectedIds),
            });
            (await this.adminCourseService.addMembers(addMembersReq)).getOrError();
            runInAction(() => {
                this.addState = DataState.data(undefined);
                this.clearSelection();
            });
            showSuccessToast({
                message: "Added successfully"
            });
            this.membersStore.loadMembers({ page: 1 });
            this.closeDialog();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.addState = DataState.error(appError);
            });
        }
    }

    async loadUsers({ page = 1 }: { page?: number } = {}) {
        runInAction(() => {
            this.loadUsersState = DataState.loading();
        });
        try {
            const req = new QueryAddMembersReq({
                courseId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchText || undefined,
                roleType: this.selectedRoleType || undefined,
                excludeExisting: true,
            });
            const result = (await this.adminCourseService.queryMembersToAdd(req)).getOrError();
            runInAction(() => {
                const vm = QueryMembersVm.fromModel(result);
                this.loadUsersState = DataState.data(vm);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.loadUsersState = DataState.error(appError);
            });
        }
    }


    closeDialog(): void {
        this.layoutStore.dialogManager.closeById(addMembersDialogId);
    }

    toggleSelectAll(checked: boolean): void {
        if (checked) {
            this.listVm.items.forEach(user => this.selectedIds.add(user.userBase.id));
        }
        else {
            this.selectedIds.clear();
        }
    }


}
