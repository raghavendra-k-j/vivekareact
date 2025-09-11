import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AdminQueryUsersReq, AdminQueryUsersRes } from "../models/AdminQueryUsersModels";
import { AdminUserListItem } from "../models/AdminUserListItem";
import { ExtractUsersRes, ImportUsersReq, ImportUsersRes } from "../models/AdminUsersImportModels";
import { UpsertUserReq } from "../models/UpsertUserModels";


export class AdminUsersService {

    private apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    get axios() {
        return this.apiClient.axios;
    }

    baseUrl(path: string) {
        return `/api/v1/admin${path}`;
    }


    async queryUsers(req: AdminQueryUsersReq): Promise<ResEither<AppError, AdminQueryUsersRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/users/query'), req.toJson());
            return ResEither.data(AdminQueryUsersRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async deleteUser(id: number): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.delete(this.baseUrl(`/users/${id}`));
            return ResEither.data(undefined);
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async upsertUser(req: UpsertUserReq): Promise<ResEither<AppError, AdminUserListItem>> {
        try {
            const resolvedPath = req.id ? `/users/${req.id}/update` : '/users';
            const res = await this.axios.post(this.baseUrl(resolvedPath), req.toJson());
            return ResEither.data(AdminUserListItem.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryById(id: number): Promise<ResEither<AppError, AdminUserListItem>> {
        try {
            const res = await this.axios.get(this.baseUrl(`/users/${id}`));
            return ResEither.data(AdminUserListItem.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async extractUsers(file: File): Promise<ResEither<AppError, ExtractUsersRes>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await this.axios.post(this.baseUrl('/users/import/extract-excel'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return ResEither.data(ExtractUsersRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    async importUser(user: ImportUsersReq): Promise<ResEither<AppError, ImportUsersRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/users/import'), user.toJson());
            return ResEither.data(ImportUsersRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }
}