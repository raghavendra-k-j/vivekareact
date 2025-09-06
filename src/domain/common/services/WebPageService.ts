import { ResEither } from "~/core/utils/ResEither";
import { BaseApiClient } from "~/infra/datasources/BaseApiClient";
import { WebPageRes } from "../models/WebPageRes";
import { AppError } from "~/core/error/AppError";
import { ApiError } from "~/infra/errors/ApiError";

export class WebPageService {

    baseApiClient: BaseApiClient;

    constructor() {
        this.baseApiClient = BaseApiClient.findInstance();
    }

    async getBySlug(slug: string): Promise<ResEither<AppError, WebPageRes>> {
        try {
            const response = await this.baseApiClient.axios.get(`/api/v1/webpages/${slug}`);
            const webPageRes = WebPageRes.fromJson(response.data);
            return ResEither.data(webPageRes);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }
}