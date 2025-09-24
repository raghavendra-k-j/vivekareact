import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { CourseListingReq, CourseListingRes } from "../models/CourseListingModels";
import { ApiError } from "~/infra/errors/ApiError";
import { CourseDetail } from "../models/CourseDetail";
import { TopicReportsReq, TopicReportsRes } from "../../lms/models/TopicsReportModels";

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

    async getCourseDetails(permalink: string): Promise<ResEither<AppError, CourseDetail>> {
        try {
            const res = await this.apiClient.axios.get(`/api/v1/courses/${permalink}/details`);
            return ResEither.data(CourseDetail.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryTopicReports(req: TopicReportsReq): Promise<ResEither<AppError, TopicReportsRes>> {
        try {
            const res = await this.apiClient.axios.post(`/api/v1/courses/${req.courseId}/reports/topics`, req.toJson());
            return ResEither.data(TopicReportsRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

}