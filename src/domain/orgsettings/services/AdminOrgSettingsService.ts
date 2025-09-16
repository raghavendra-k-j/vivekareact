import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { OrgGeneralSettingsRes, SaveGeneralSettingsReq } from "../models/OrgGeneralSettingsRes";
import { AppError } from "~/core/error/AppError";
import { ApiError } from "~/infra/errors/ApiError";
import { UploadLogoRes } from "../models/UploadLogoRes";
import { EntityCatalogDetail } from "../models/EntityCatalogDetail";
import { UpdateEntityCatalogReq } from "../models/UpdateEntityCatalogReq";

export class AdminOrgSettingsService {
    
    apiClient: ApiClient;

    baseUrl(path: string) {
        return `/api/v1/admin/org-settings${path}`;
    }

    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    async getGeneralSettings(): Promise<ResEither<AppError, OrgGeneralSettingsRes>> {
        try {
            const response = await this.apiClient.axios.get(this.baseUrl("/general-settings"));
            return ResEither.data(OrgGeneralSettingsRes.fromJson(response.data));
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    async saveGeneralSettings(req: SaveGeneralSettingsReq): Promise<ResEither<AppError, OrgGeneralSettingsRes>> {
        try {
            const response = await this.apiClient.axios.post(this.baseUrl("/general-settings"), req.toJson());
            return ResEither.data(OrgGeneralSettingsRes.fromJson(response.data));
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    async uploadLogo(file: File | null): Promise<ResEither<AppError, UploadLogoRes>> {
        try {
            const formData = new FormData();
            if (file) {
                formData.append("file", file, file.name);
            }
            const response = await this.apiClient.axios.post(this.baseUrl("/logo"), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return ResEither.data(UploadLogoRes.fromJson(response.data));
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async saveEntityCatalogChanges(req: UpdateEntityCatalogReq): Promise<ResEither<AppError, EntityCatalogDetail>> {
        try {
            const response = await this.apiClient.axios.post(this.baseUrl("/entitydict/catalog/save"), req.toJson());
            return ResEither.data(EntityCatalogDetail.fromJson(response.data));
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async getEntityCatalog(): Promise<ResEither<AppError, EntityCatalogDetail>> {
        try {
            const response = await this.apiClient.axios.get(this.baseUrl("/entitydict/catalog"));
            return ResEither.data(EntityCatalogDetail.fromJson(response.data));
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

}