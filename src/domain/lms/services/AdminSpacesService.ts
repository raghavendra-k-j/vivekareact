import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { CreateSpaceReq, CreateSpaceRes } from "../models/CreateSpaceModels";
import { AddMembersReq, AddMembersRes } from "../models/AddRemoveMembersModels";
import { RemoveMembersReq, RemoveMembersRes } from "../models/AddRemoveMembersModels";
import { AdminSpaceListReq, AdminSpaceListRes } from "../models/AdminQuerySpacesModels";
import { AiSpacesCreatorReq, AiSpacesCreatorRes } from "../models/AiSpacesCreatorModels";
import { AdminCCListReq, AdminCCListRes } from "../models/AdminQueryCCModels";
import { AdminCMListReq, AdminCMListRes } from "../models/AdminCMListModels";

export class AdminSpacesService {
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

    async createSpace(req: CreateSpaceReq): Promise<ResEither<AppError, CreateSpaceRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/spaces'), req.toJson());
            return ResEither.data(CreateSpaceRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async addMembers(req: AddMembersReq): Promise<ResEither<AppError, AddMembersRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/spaces/members/add'), req.toJson());
            return ResEither.data(AddMembersRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async removeMembers(req: RemoveMembersReq): Promise<ResEither<AppError, RemoveMembersRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/spaces/members/remove'), req.toJson());
            return ResEither.data(RemoveMembersRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async querySpaces(req?: AdminSpaceListReq): Promise<ResEither<AppError, AdminSpaceListRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/spaces/query'), req ? req.toJson() : {});
            return ResEither.data(AdminSpaceListRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async aiGenerateSpaceStructure(req: AiSpacesCreatorReq): Promise<ResEither<AppError, AiSpacesCreatorRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/spaces/structure/ai-generate'), req.toJson());
            return ResEither.data(AiSpacesCreatorRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryCourseContents(req: AdminCCListReq): Promise<ResEither<AppError, AdminCCListRes>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/courses/${req.courseId}/contents/query`), req.toJson());
            return ResEither.data(AdminCCListRes.fromJson(res.data, new Date()));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryMembers(req: AdminCMListReq): Promise<ResEither<AppError, AdminCMListRes>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/courses/${req.courseId}/members/query`), req.toJson());
            return ResEither.data(AdminCMListRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

}