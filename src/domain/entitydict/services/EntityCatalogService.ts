import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { EntityCatalog } from "../models/EntityCatalog";

export class EntityCatalogService {

    apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    baseUrl(path: string): string {
        return `/api/v1/entitydict${path}`;
    }

    async getEntityCatalog(): Promise<ResEither<AppError, EntityCatalog>> {
        try {
            const res = await this.apiClient.axios.get(this.baseUrl("/catalog"));
            const data = EntityCatalog.fromJson(res.data);
            return ResEither.data(data);
        }
        catch (e) {
            const apiError = ApiError.fromAny(e);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

}