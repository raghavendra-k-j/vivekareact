import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AdminCourseDetail } from "../models/AdminCourseDetail";
import { QueryAddMembersReq, QueryAddMembersRes } from "../models/QueryAddMembersModels";

export class AdminCourseService {
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

    async getCourseDetails(courseId: number): Promise<ResEither<AppError, AdminCourseDetail>> {
        try {
            const res = await this.axios.get(this.baseUrl(`/spaces/courses/${courseId}/details`));
            return ResEither.data(AdminCourseDetail.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryMembersToAdd(req: QueryAddMembersReq): Promise<ResEither<AppError, QueryAddMembersRes>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/courses/${req.courseId}/members/add/query`), req.toJson());
            return ResEither.data(QueryAddMembersRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


}

