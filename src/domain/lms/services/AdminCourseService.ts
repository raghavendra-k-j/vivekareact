import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AdminCourseDetail } from "../models/AdminCourseDetail";
import { QueryAddMembersReq, QueryAddMembersRes } from "../models/QueryAddMembersModels";
import { AddMembersReq, AddMembersRes, RemoveMembersReq, RemoveMembersRes } from "../models/AddRemoveMembersModels";
import { AdminCMListReq, AdminCMListRes } from "../models/AdminCMListModels";
import { AdminCCListReq, AdminCCListRes } from "../models/AdminQueryCCModels";
import { AdminQueryMyCoursesReq, AdminQueryMyCoursesRes } from "../models/AdminMyCoursesListingModels";
import { UpsertTopicReq } from "../models/UpsertTopicReq";
import { AdminTopicListReq } from "../models/AdminTopicListReq";
import { AdminTopicListRes } from "../models/AdminTopicListRes";
import { AdminTopicItem } from "../models/AdminTopicItem";
import { BoolResult } from "~/domain/common/models/BoolResult";

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

    async getCourseDetailsByPermalink(permalink: string): Promise<ResEither<AppError, AdminCourseDetail>> {
        try {
            const res = await this.axios.get(this.baseUrl(`/spaces/courses/${permalink}/details`));
            return ResEither.data(AdminCourseDetail.fromJson(res.data));
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

    async addMembers(req: AddMembersReq): Promise<ResEither<AppError, AddMembersRes>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/courses/${req.courseId}/members/add`), req.toJson());
            return ResEither.data(AddMembersRes.fromJson(res.data));
        }
        catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async removeMembers(req: RemoveMembersReq): Promise<ResEither<AppError, RemoveMembersRes>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/courses/${req.courseId}/members/remove`), req.toJson());
            return ResEither.data(RemoveMembersRes.fromJson(res.data));
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

    async queryMyCourses(req: AdminQueryMyCoursesReq): Promise<ResEither<AppError, AdminQueryMyCoursesRes>> {
        try {
            const res = await this.axios.post(this.baseUrl('/spaces/my-courses/query'), req ? req.toJson() : {});
            return ResEither.data(AdminQueryMyCoursesRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async upsertTopic(req: UpsertTopicReq): Promise<ResEither<AppError, AdminTopicItem>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/courses/${req.spaceId}/topics/upsert`), req.toJson());
            return ResEither.data(AdminTopicItem.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async queryTopics(req: AdminTopicListReq): Promise<ResEither<AppError, AdminTopicListRes>> {
        try {
            const res = await this.axios.post(this.baseUrl(`/spaces/courses/${req.spaceId}/topics/query`), req.toJson());
            return ResEither.data(AdminTopicListRes.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

    async deleteTopic(courseId: number, topicId: number): Promise<ResEither<AppError, BoolResult>> {
        try {
            const res = await this.axios.delete(this.baseUrl(`/spaces/courses/${courseId}/topics/${topicId}`));
            return ResEither.data(BoolResult.fromJson(res.data));
        } catch (err) {
            const apiError = ApiError.fromAny(err);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }

}

