import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { HomeLayoutData } from "../models/HomeLayout";
import { ApiError } from "~/infra/errors/ApiError";

export async function getHomeLayout(): Promise<ResEither<AppError, HomeLayoutData>> {
    const apiClient = ApiClient.findInstance();
    try {
        const res = await apiClient.axios.get(`/api/v1/home/layout`);
        return ResEither.data(HomeLayoutData.fromJson(res.data));
    }
    catch (err) {
        const apiError = ApiError.fromAny(err);
        const appError = AppError.fromAny(apiError);
        return ResEither.error(appError);
    }
}