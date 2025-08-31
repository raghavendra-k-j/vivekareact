import { ResEither } from "~/core/utils/ResEither";
import type { ApiClient } from "../../datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AdminFormDetail } from "~/domain/forms/admin/models/AdminFormDetail";
import { logger } from "~/core/utils/logger";
import { UpsertQuestionReq, UpsertQuestionRes } from "~/domain/forms/admin/models/UpsertQuestionModel";
import { AdminQuestionListRes } from "~/domain/forms/admin/models/AdminQuestionListRes";
import { DeleteQuestionDependencies } from "~/domain/forms/admin/models/DeleteQuestionDependencies";
import { GetQuestionRes } from "~/domain/forms/admin/models/GetQuestionRes";
import { QueryFormsToCompareReq } from "~/domain/forms/admin/models/compare/QueryFormsToCompareReq";
import { QueryFormsToCompareRes } from "~/domain/forms/admin/models/compare/QueryFormsToCompareRes";
import { FormCompareMetaData } from "~/domain/forms/admin/models/compare/FormCompareMetaData";
import { FormCompareDetails } from "~/domain/forms/admin/models/compare/FormCompareDetails";
import { FormComparisonOverviewReq } from "~/domain/forms/admin/models/compare/FormComparisonOverviewReq";
import { FormComparisonOverview } from "~/domain/forms/admin/models/compare/FormComparisonOverview";
import { FormCompareUserListReq } from "~/domain/forms/admin/models/compare/FormCompareUserListReq";
import { FormCompareUserList } from "~/domain/forms/admin/models/compare/FormCompareUserList";
import { FormTranslation } from "~/domain/forms/admin/models/translation/FormTranslation";
import { SaveTranslationReq } from "~/domain/forms/admin/models/translation/SaveTranslationReq";


export class AdminFormRepo {

    private apiClient: ApiClient;

    constructor({ apiClient }: { apiClient: ApiClient }) {
        this.apiClient = apiClient;
    }

    get axios() {
        return this.apiClient.axios;
    }

    async getFormDetails({ permalink }: { permalink: string }): Promise<ResEither<ApiError, AdminFormDetail>> {
        try {
            const response = await this.axios.get(`/api/v1/admin/forms/${permalink}`);
            const formDetail = AdminFormDetail.fromMap(response.data);
            return ResEither.data(formDetail);
        }
        catch (error) {
            logger.error("Error fetching form details", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async upsertQuestion(req: UpsertQuestionReq): Promise<ResEither<ApiError, UpsertQuestionRes>> {
        try {
            let url = `/api/v1/admin/forms/${req.formId}/questions`;
            if (req.id) {
                url += `/${req.id}`;
            }
            const response = await this.axios.post(url, req.toJson());
            const question = UpsertQuestionRes.fromMap(response.data);
            return ResEither.data(question);
        }
        catch (error) {
            logger.error("Error creating question", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async queryQuestions({ formId, searchQuery }: { formId: number, searchQuery?: string }): Promise<ResEither<ApiError, AdminQuestionListRes>> {
        try {
            const response = await this.axios.get(`/api/v1/admin/forms/${formId}/questions`, {
                params: { searchQuery }
            });
            return ResEither.data(AdminQuestionListRes.fromMap(response.data));
        }
        catch (error) {
            logger.error("Error fetching questions", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async getQuestionById({ formId, questionId }: { formId: number, questionId: number }): Promise<ResEither<ApiError, GetQuestionRes>> {
        try {
            const response = await this.axios.get(`/api/v1/admin/forms/${formId}/questions/${questionId}`);
            const question = GetQuestionRes.fromJson(response.data);
            return ResEither.data(question);
        }
        catch (error) {
            logger.error("Error fetching question by id", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }


    async deleteQuestion({ formId, questionId }: { formId: number, questionId: number }): Promise<ResEither<ApiError, void>> {
        try {
            await this.axios.delete(`/api/v1/admin/forms/${formId}/questions/${questionId}`);
            return ResEither.data(undefined);
        }
        catch (error) {
            logger.error("Error deleting question", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async toggleQuestionsMandatory({ formId, mandatory }: { formId: number, mandatory: boolean }): Promise<ResEither<ApiError, void>> {
        try {
            await this.axios.post(`/api/v1/admin/forms/${formId}/questions/toggle-mandatory`, { mandatory });
            return ResEither.data(undefined);
        }
        catch (error) {
            logger.error("Error toggling questions mandatory", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async getDeleteDependencies({ formId, questionId }: { formId: number, questionId: number }): Promise<ResEither<ApiError, DeleteQuestionDependencies>> {
        try {
            const response = await this.axios.post(`/api/v1/admin/forms/${formId}/questions/${questionId}/dependency`);
            return ResEither.data(DeleteQuestionDependencies.fromJson(response.data));
        }
        catch (error) {
            logger.error("Error fetching delete dependencies", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async queryFormsToCompare(req: QueryFormsToCompareReq): Promise<ResEither<ApiError, QueryFormsToCompareRes>> {
        try {
            const response = await this.axios.post(`/api/v1/admin/forms/${req.formId}/compare/candidates`, req.toJson());
            const data = QueryFormsToCompareRes.fromJson(response.data);
            return ResEither.data(data);
        } catch (e) {
            const error = ApiError.fromAny(e);
            return ResEither.error(error);
        }
    }

    async queryComparisionMetaData(formId: number): Promise<ResEither<ApiError, FormCompareMetaData>> {
        try {
            const response = await this.axios.get(`/api/v1/admin/forms/${formId}/compare/metadata`);
            const data = FormCompareMetaData.fromJson(response.data);
            return ResEither.data(data);
        }
        catch (e) {
            const error = ApiError.fromAny(e);
            return ResEither.error(error);
        }
    }

    async getFormCompareDetails(formAId: number, formBId: number, restrictAutoOrganize: boolean): Promise<ResEither<ApiError, FormCompareDetails>> {
        try {
            const response = await this.axios.get(
                `/api/v1/admin/forms/${formAId}/compare/${formBId}/details`,
                {
                    params: {
                        restrictAutoOrganize: restrictAutoOrganize
                    }
                }
            );
            const data = FormCompareDetails.fromJson(response.data);
            return ResEither.data(data);
        } catch (e) {
            const error = ApiError.fromAny(e);
            return ResEither.error(error);
        }
    }


    async getComparisonOverview(req: FormComparisonOverviewReq): Promise<ResEither<ApiError, FormComparisonOverview>> {
        try {
            const response = await this.axios.post(`/api/v1/admin/forms/${req.formAId}/compare/${req.formBId}/overview`, req.toJson());
            const data = FormComparisonOverview.fromJson(response.data);
            return ResEither.data(data);
        } catch (e) {
            const error = ApiError.fromAny(e);
            return ResEither.error(error);
        }
    }

    async getComparisonUserList(req: FormCompareUserListReq): Promise<ResEither<ApiError, FormCompareUserList>> {
        try {
            const response = await this.axios.post(`/api/v1/admin/forms/${req.formAId}/compare/${req.formBId}/users`, req.toJson());
            const data = FormCompareUserList.fromJson(response.data);
            return ResEither.data(data);
        } catch (e) {
            const error = ApiError.fromAny(e);
            return ResEither.error(error);
        }
    }

    async saveTranslation(req: SaveTranslationReq): Promise<ResEither<ApiError, void>> {
        try {
            await this.axios.post(`/api/v1/admin/forms/${req.formId}/translations/${req.languageId}`, req.toReqBody());
            return ResEither.data(undefined);
        }
        catch (error) {
            logger.error("Error saving form translation", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async getTranslation(formId: number, languageId: string): Promise<ResEither<ApiError, FormTranslation>> {
        try {
            const response = await this.axios.get(`/api/v1/admin/forms/${formId}/translations/${languageId}`);
            const formDetail = FormTranslation.fromJson(response.data);
            return ResEither.data(formDetail);
        }
        catch (error) {
            logger.error("Error fetching form translation", error);
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

}