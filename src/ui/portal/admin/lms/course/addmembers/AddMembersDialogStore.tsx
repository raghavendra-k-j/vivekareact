import { makeObservable, observable, action, computed, runInAction } from "mobx";
import { UserRoleBase } from "~/domain/common/models/UserRoleBase";
import { DataState } from "~/ui/utils/DataState";
import { MembersStore } from "../members/MembersStore";
import { QueryMembersVm } from "./QueryMembersVm";
import { addMembersDialogId } from "./utils";
import { QueryAddMembersReq } from "~/domain/lms/models/QueryAddMembersModels";
import { UserRoleType } from "~/domain/common/models/UserRoleType";
import { AppError } from "~/core/error/AppError";

export class AddMembersDialogStore {

    membersStore: MembersStore;

    searchText: string = "";
    selectedIds: Set<number> = new Set();
    selectedRoleType: UserRoleType | null = null;
    rolesLoadState: DataState<UserRoleBase> = DataState.init();
    loadUsersState: DataState<QueryMembersVm> = DataState.init();
    addState: DataState<void> = DataState.init();

    private currentPage: number = 1;
    private pageSize: number = 20;

    constructor({ membersPageStore }: { membersPageStore: MembersStore }) {
        this.membersStore = membersPageStore;
        makeObservable(this, {
            searchText: observable,
            selectedIds: observable.shallow,
            selectedRoleType: observable,
            rolesLoadState: observable.ref,
            loadUsersState: observable.ref,
            addState: observable.ref,
            setSearchText: action,
            setSelectedRoleType: action,
            toggleUserSelection: action,
            loadUsers: action,
            loadNextPage: action,
            resetSearch: action,
            clearSelection: action,
            addMembers: action,
            dispose: action,
            canAddMembers: computed,
            hasSelectedUsers: computed,
            isLoadingUsers: computed,
            selectedUsersCount: computed,
            hasMorePages: computed,
            hasLoadedUsers: computed,
            totalUsersCount: computed,
        });
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

    get canAddMembers(): boolean {
        return this.selectedIds.size > 0 && !this.addState.isLoading;
    }

    get hasSelectedUsers(): boolean {
        return this.selectedIds.size > 0;
    }

    get isLoadingUsers(): boolean {
        return this.loadUsersState.isLoading;
    }

    get selectedUsersCount(): number {
        return this.selectedIds.size;
    }

    get hasMorePages(): boolean {
        return this.loadUsersState.isData && this.currentPage < this.loadUsersState.data!.pageInfo.totalPages;
    }

    get hasLoadedUsers(): boolean {
        return this.loadUsersState.isData && this.loadUsersState.data!.members.length > 0;
    }

    get totalUsersCount(): number {
        return this.loadUsersState.isData ? this.loadUsersState.data!.members.length : 0;
    }

    private searchTimeoutId: number | null = null;
    private readonly searchDebounceMs = 300;

    setSearchText(text: string) {
        this.searchText = text;
        this.currentPage = 1; // Reset to first page when search changes

        // Clear existing timeout
        if (this.searchTimeoutId) {
            clearTimeout(this.searchTimeoutId);
        }

        // Debounce the search
        this.searchTimeoutId = window.setTimeout(() => {
            this.loadUsers();
        }, this.searchDebounceMs);
    }

    setSelectedRoleType(roleType: UserRoleType | null) {
        this.selectedRoleType = roleType;
        this.currentPage = 1; // Reset to first page when filter changes
        this.loadUsers();
    }

    toggleUserSelection(userId: number) {
        if (this.selectedIds.has(userId)) {
            this.selectedIds.delete(userId);
        } else {
            this.selectedIds.add(userId);
        }
    }

    resetSearch() {
        this.searchText = "";
        this.selectedRoleType = null;
        this.currentPage = 1;
        this.loadUsers();
    }

    clearSelection() {
        this.selectedIds.clear();
    }

    async addMembers() {
        if (!this.canAddMembers) return;

        runInAction(() => {
            this.addState = DataState.loading();
        });

        try {
            // Here you would implement the actual API call to add members
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1000));

            runInAction(() => {
                this.addState = DataState.data(undefined);
                this.clearSelection();
            });

            // Close dialog after successful addition
            this.closeDialog();
        } catch (error) {
            runInAction(() => {
                this.addState = DataState.error(AppError.fromAny(error));
            });
        }
    }

    async loadUsers() {
        runInAction(() => {
            this.loadUsersState = DataState.loading();
        });

        try {
            const req = new QueryAddMembersReq({
                courseId: this.courseId,
                page: this.currentPage,
                pageSize: this.pageSize,
                searchQuery: this.searchText || undefined,
                roleType: this.selectedRoleType || undefined,
                excludeExisting: true,
            });

            const result = await this.adminCourseService.queryMembersToAdd(req);

            runInAction(() => {
                if (result.isError) {
                    this.loadUsersState = DataState.error(result.error);
                } else {
                    const vm = QueryMembersVm.fromModel(result.data);
                    this.loadUsersState = DataState.data(vm);
                }
            });
        } catch (error) {
            runInAction(() => {
                this.loadUsersState = DataState.error(AppError.fromAny(error));
            });
        }
    }

    loadNextPage() {
        if (this.hasMorePages) {
            this.currentPage++;
            this.loadUsers();
        }
    }

    closeDialog(): void {
        this.dispose();
        this.layoutStore.dialogManager.closeById(addMembersDialogId);
    }

    dispose(): void {
        if (this.searchTimeoutId) {
            clearTimeout(this.searchTimeoutId);
            this.searchTimeoutId = null;
        }
    }

}
