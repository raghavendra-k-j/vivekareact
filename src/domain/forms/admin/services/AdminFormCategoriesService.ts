import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AdminQueryCategoriesReq, AdminQueryCategoriesRes } from "../models/categories/AdminQueryCategoriesModels";
import { FormCategoryTile } from "../models/categories/FormCategoryTile";
import { AttachCategoriesRes } from "../models/categories/AttachCategoriesRes";
import { AdminFormsCategoryFilterRes } from "../models/categories/AdminFormsCategoryFilterRes";


export class AdminFormCategoriesService {

    _apiClient: ApiClient;

    constructor() {
        this._apiClient = ApiClient.findInstance();
    }

    get axios() {
        return this._apiClient.axios;
    }

    baseUrl(path: string) {
        return `/api/v1/admin${path}`;
    }

    async createCategory(name: string): Promise<ResEither<AppError, number>> {
        try {
            const res = await this.axios.post(this.baseUrl('/categories'), { name });
            return ResEither.data(res.data.id);
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async editCategory(categoryId: number, name: string): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.post(this.baseUrl(`/categories/${categoryId}`), { name });
            return ResEither.data(undefined);
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async deleteCategory(categoryId: number): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.delete(this.baseUrl(`/categories/${categoryId}`));
            return ResEither.data(undefined);
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async attachCategory(formId: number, categoryId: number): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.post(this.baseUrl(`/forms/${formId}/categories`), { formId, categoryId });
            return ResEither.data(undefined);
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async detachCategory(formId: number, categoryId: number): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.delete(this.baseUrl(`/forms/${formId}/categories/${categoryId}`));
            return ResEither.data(undefined);
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryCategories(req: AdminQueryCategoriesReq): Promise<ResEither<AppError, AdminQueryCategoriesRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/categories/query'), req.toJson());
            return ResEither.data(AdminQueryCategoriesRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async getAttachedCategories({ formId }: { formId: number }): Promise<ResEither<AppError, FormCategoryTile[]>> {
        try {
            const res = await this.axios.get(this.baseUrl(`/forms/${formId}/categories`));
            return ResEither.data((res.data as object[]).map(itemJson => FormCategoryTile.fromJson(itemJson)));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async getCategoriesToAttach({ formId, searchQuery }: { formId: number; searchQuery?: string }): Promise<ResEither<AppError, AttachCategoriesRes>> {
        try {
            const res = await this.axios.get(this.baseUrl(`/forms/${formId}/categories/all`), {
                params: {
                    searchQuery: searchQuery,
                }
            });
            return ResEither.data(AttachCategoriesRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async getFormsCategoriesFilter(): Promise<ResEither<AppError, AdminFormsCategoryFilterRes>> {
        try {
            const res = await this.axios.get(this.baseUrl('/forms/categories-filter'));
            return ResEither.data(AdminFormsCategoryFilterRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

}