import { makeObservable, observable, action, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import {
    AdminQueryUsersReq,
    AdminQueryUsersRes,
    UserSortField,
    UserSortOrder,
} from "~/domain/users/models/AdminQueryUsersModels";
import { AdminUsersService } from "~/domain/users/services/AdminUsersService";
import { DataState } from "~/ui/utils/DataState";

export class UsersPageStore {
    usersService: AdminUsersService;

    searchText: string = "";
    loadState: DataState<AdminQueryUsersRes> = DataState.init();
    pageSize: number = 20;

    currentPage: number = 1;
    sortField?: UserSortField;
    sortOrder?: UserSortOrder;

    private searchDebounce = createSearchDebounce(() => {
        this.loadUsers({ page: 1 });
    });

    constructor({ usersService }: { usersService: AdminUsersService }) {
        this.usersService = usersService;
        makeObservable(this, {
            searchText: observable,
            loadState: observable.ref,
            pageSize: observable,
            currentPage: observable,
            sortField: observable,
            sortOrder: observable,
            setSearchText: action.bound,
            onPageChanged: action.bound,
            onSortChanged: action.bound,
            setSort: action.bound,
        });
    }

    setSearchText(text: string) {
        this.searchText = text;
        this.currentPage = 1;
        this.searchDebounce.invoke();
    }

    onPageChanged(page: number) {
        if (page === this.currentPage) return;
        this.currentPage = page;
        this.loadUsers({ page });
    }

    onSortChanged(field: UserSortField) {
        if (this.sortField === field) {
            this.sortOrder =
                this.sortOrder === UserSortOrder.ASC ? UserSortOrder.DESC : UserSortOrder.ASC;
        } else {
            this.sortField = field;
            this.sortOrder = UserSortOrder.ASC;
        }
        this.currentPage = 1;
        this.loadUsers({ page: 1 });
    }

    setSort(field?: UserSortField, order?: UserSortOrder) {
        this.sortField = field;
        this.sortOrder = order;
        this.currentPage = 1;
        this.loadUsers({ page: 1 });
    }

    async loadUsers({ page = this.currentPage }: { page?: number }) {
        try {
            const finalSearchText = this.searchText.trim();
            runInAction(() => {
                this.loadState = DataState.loading();
            });

            const req = new AdminQueryUsersReq({
                page,
                pageSize: this.pageSize,
                searchQuery: finalSearchText,
                sortField: this.sortField,
                sortOrder: this.sortOrder,
            });

            const res = (await this.usersService.queryUsers(req)).getOrError();

            runInAction(() => {
                this.currentPage = page;
                this.loadState = DataState.data(res);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.loadState = DataState.error(appError);
            });
        }
    }

    dispose() {
        this.searchDebounce.cancel();
    }
}
