import { makeObservable, observable, action, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import {
    AdminQueryCategoriesReq,
    AdminQueryCategoriesRes,
} from "~/domain/forms/admin/models/categories/AdminQueryCategoriesModels";
import { AdminFormCategoriesService } from "~/domain/forms/admin/services/AdminFormCategoriesService";
import { DataState } from "~/ui/utils/DataState";

export class CategoriesPageStore {
    categoriesService: AdminFormCategoriesService;

    searchText: string = "";
    loadState: DataState<AdminQueryCategoriesRes> = DataState.init();
    pageSize: number = 20;

    currentPage: number = 1;

    // Dialog states
    showCreateDialog: boolean = false;
    showEditDialog: boolean = false;
    editingCategoryId: number | null = null;

    private searchDebounce = createSearchDebounce(() => {
        this.loadCategories({ page: 1 });
    });

    constructor({ categoriesService }: { categoriesService: AdminFormCategoriesService }) {
        this.categoriesService = categoriesService;
        makeObservable(this, {
            searchText: observable,
            loadState: observable.ref,
            pageSize: observable,
            currentPage: observable,
            showCreateDialog: observable,
            showEditDialog: observable,
            editingCategoryId: observable,
            setSearchText: action.bound,
            onPageChanged: action.bound,
            openCreateDialog: action.bound,
            closeCreateDialog: action.bound,
            openEditDialog: action.bound,
            closeEditDialog: action.bound,
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
        this.loadCategories({ page });
    }

    openCreateDialog() {
        this.showCreateDialog = true;
    }

    closeCreateDialog() {
        this.showCreateDialog = false;
    }

    openEditDialog(categoryId: number) {
        this.editingCategoryId = categoryId;
        this.showEditDialog = true;
    }

    closeEditDialog() {
        this.showEditDialog = false;
        this.editingCategoryId = null;
    }

    async loadCategories({ page = this.currentPage }: { page?: number }) {
        try {
            const finalSearchText = this.searchText.trim();
            runInAction(() => {
                this.loadState = DataState.loading();
            });

            const req = new AdminQueryCategoriesReq({
                page,
                pageSize: this.pageSize,
                searchQuery: finalSearchText,
            });

            const res = (await this.categoriesService.queryCategories(req)).getOrError();

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

    async createCategory(name: string): Promise<void> {
        const res = await this.categoriesService.createCategory(name);
        if (res.isData) {
            this.closeCreateDialog();
            this.loadCategories({ page: 1 }); // Reload to show new category
        } else {
            throw new Error(res.error.message);
        }
    }

    async editCategory(categoryId: number, name: string): Promise<void> {
        const res = await this.categoriesService.editCategory(categoryId, name);
        if (res.isData) {
            this.closeEditDialog();
            this.loadCategories({ page: this.currentPage }); // Reload current page
        } else {
            throw new Error(res.error.message);
        }
    }

    dispose() {
        this.searchDebounce.cancel();
    }
}
