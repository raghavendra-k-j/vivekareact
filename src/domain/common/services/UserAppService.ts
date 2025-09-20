import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { UserAppConfig } from "../models/UserAppConfig";

export class UserAppService {
    apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    async getUserAppConfig(): Promise<ResEither<AppError, UserAppConfig>> {
        try {
            const res = await this.apiClient.axios.get(`/api/v1/user-app-config`);
            return ResEither.data(UserAppConfig.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }
}