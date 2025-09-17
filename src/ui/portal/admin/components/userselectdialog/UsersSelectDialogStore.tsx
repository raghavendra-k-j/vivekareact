import { makeObservable, observable, action, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { AdminQueryUsersReq, AdminQueryUsersRes } from "~/domain/users/models/AdminQueryUsersModels";
import { AdminUserListItem } from "~/domain/users/models/AdminUserListItem";
import { AdminUsersService } from "~/domain/users/services/AdminUsersService";
import { DataState } from "~/ui/utils/DataState";

export class UsersSelectDialogStore {
	usersService: AdminUsersService;

	searchText: string = "";
	loadState: DataState<AdminQueryUsersRes> = DataState.init();
	pageSize: number = 20;

	currentPage: number = 1;
	selectedUser: AdminUserListItem | null = null;

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
			selectedUser: observable,
			setSearchText: action.bound,
			onPageChanged: action.bound,
			setSelected: action.bound,
			setOpen: action.bound,
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

	setSelected(user: AdminUserListItem | null) {
		this.selectedUser = user;
	}

	setOpen(_v: boolean) {
		// dialog open/close lifecycle is usually driven by parent/dialog manager
		// kept for parity with other dialog stores
	}

	async loadUsers({ page = this.currentPage }: { page?: number } = {}) {
		try {
			const finalSearchText = this.searchText.trim();
			runInAction(() => {
				this.loadState = DataState.loading();
			});

			const req = new AdminQueryUsersReq({
				page,
				pageSize: this.pageSize,
				searchQuery: finalSearchText,
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
