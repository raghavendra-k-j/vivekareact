import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCMListReq } from "~/domain/lms/models/AdminCMListModels";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { AdminCMListVm } from "./models/AdminCMListVm";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { SpaceMemberRole } from "~/domain/lms/models/SpaceMemberRole";
import { addMembersDialogId } from "../addmembers/utils";
import AddMembersDialog from "../addmembers/AddMembersDialog";

export class MembersStore {
    layoutStore: CourseLayoutStore;

    searchQuery: string = "";
    queryState: DataState<AdminCMListVm> = DataState.init();
    pageSize: number = 50;
    currentPage: number = 1;
    selectedRole: SpaceMemberRole | null = null;

    private debouncedLoadMembers: () => void;

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            queryState: observable.ref,
            searchQuery: observable,
            currentPage: observable,
            selectedRole: observable,
        });

        this.debouncedLoadMembers = createSearchDebounce(() => this.loadMembers({ page: 1 })).invoke;
    }

    get adminSpacesService(): AdminSpacesService {
        return this.layoutStore.layoutStore.adminSpacesService;
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
                this.currentPage = page;
            });

            const req = new AdminCMListReq({
                courseId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery || null,
                memberRole: this.selectedRole || null,
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
        runInAction(() => {
            this.searchQuery = query;
            this.currentPage = 1;
        });
        this.debouncedLoadMembers();
    }

    goToPage(page: number) {
        if (page < 1 || (this.queryState.isData && page > this.listVm.pageInfo.totalPages)) {
            return;
        }
        this.loadMembers({ page });
    }

    setSelectedRole(role: SpaceMemberRole | null) {
        runInAction(() => {
            this.selectedRole = role;
        });
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


}