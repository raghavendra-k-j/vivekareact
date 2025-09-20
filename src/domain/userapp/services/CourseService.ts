import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { CourseListingReq, CourseListingRes } from "../models/CourseListingModels";
import { ApiError } from "~/infra/errors/ApiError";

export class CourseService {

    apiClient: ApiClient;

    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    async queryMyCourses(req: CourseListingReq): Promise<ResEither<AppError, CourseListingRes>> {
        try {
            const res = await this.apiClient.axios.post(`/api/v1/courses/query`, req.toJson());
            return ResEither.data(CourseListingRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


}