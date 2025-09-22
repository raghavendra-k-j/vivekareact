import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AdminSpaceListReq, AdminSpaceListRes } from "../models/AdminSpaceListingModels";
import { AiSpacesCreatorReq, AiSpacesCreatorRes } from "../models/AiSpacesCreatorModels";
import { CreateSpaceReq, CreateSpaceRes } from "../models/CreateSpaceModels";
import { RenameSpaceReq, RenameSpaceRes } from "../models/RenameSpaceModels";

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

    async querySpaces(req: AdminSpaceListReq): Promise<ResEither<AppError, AdminSpaceListRes>> {
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

    async renameSpace(spaceId: number, req: RenameSpaceReq): Promise<ResEither<AppError, RenameSpaceRes>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/${spaceId}/rename`), req.toJson());
            return ResEither.data(RenameSpaceRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async deleteSpace(spaceId: number): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.delete(this.baseUrl(`/spaces/${spaceId}`));
            return ResEither.data(undefined);
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async bulkDeleteSpaces(spaceIds: number[]): Promise<ResEither<AppError, void>> {
        try {
            await this.axios.post(this.baseUrl('/spaces/bulk-delete'), { spaceIds });
            return ResEither.data(undefined);
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


}