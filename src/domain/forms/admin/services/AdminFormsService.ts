import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { AdminQuestionListRes } from "~/domain/forms/admin/models/AdminQuestionListRes";
import { DeleteQuestionDependencies } from "~/domain/forms/admin/models/DeleteQuestionDependencies";
import { UpsertQuestionReq, UpsertQuestionRes } from "~/domain/forms/admin/models/UpsertQuestionModel";
import { FormCompareDetails } from "~/domain/forms/admin/models/compare/FormCompareDetails";
import { FormCompareMetaData } from "~/domain/forms/admin/models/compare/FormCompareMetaData";
import { FormCompareUserList } from "~/domain/forms/admin/models/compare/FormCompareUserList";
import { FormCompareUserListReq } from "~/domain/forms/admin/models/compare/FormCompareUserListReq";
import { FormComparisonOverview } from "~/domain/forms/admin/models/compare/FormComparisonOverview";
import { FormComparisonOverviewReq } from "~/domain/forms/admin/models/compare/FormComparisonOverviewReq";
import { QueryFormsToCompareReq } from "~/domain/forms/admin/models/compare/QueryFormsToCompareReq";
import { QueryFormsToCompareRes } from "~/domain/forms/admin/models/compare/QueryFormsToCompareRes";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { AdminFormRepo } from "~/infra/repos/forms/AdminFormRepo";
import { AdminFormDetail } from "../models/AdminFormDetail";
import { GetQuestionRes } from "../models/GetQuestionRes";
import { FormTranslation } from "../models/translation/FormTranslation";
import { SaveTranslationReq } from "../models/translation/SaveTranslationReq";
import { CreateNewReq } from "../models/CreateNewReq";

export class AdminFormsService {

    private readonly adminFormRepo: AdminFormRepo;

    constructor() {
        this.adminFormRepo = new AdminFormRepo({ apiClient: ApiClient.findInstance() });
    }

    async getFormDetails({ permalink }: { permalink: string }): Promise<ResEither<AppError, AdminFormDetail>> {
        return await this.adminFormRepo.getFormDetails({ permalink });
    }

    async upsertQuestion(req: UpsertQuestionReq): Promise<ResEither<AppError, UpsertQuestionRes>> {
        return await this.adminFormRepo.upsertQuestion(req);
    }

    async queryQuestions({ formId, searchQuery }: { formId: number, searchQuery?: string }): Promise<ResEither<AppError, AdminQuestionListRes>> {
        return await this.adminFormRepo.queryQuestions({ formId, searchQuery });
    }

    async getQuestionById({ formId, questionId }: { formId: number, questionId: number }): Promise<ResEither<AppError, GetQuestionRes>> {
        return await this.adminFormRepo.getQuestionById({ formId, questionId });
    }

    async deleteQuestion({ formId, questionId }: { formId: number, questionId: number }): Promise<ResEither<AppError, void>> {
        return await this.adminFormRepo.deleteQuestion({ formId, questionId });
    }

    async toggleQuestionsMandatory({ formId, mandatory }: { formId: number, mandatory: boolean }): Promise<ResEither<AppError, void>> {
        return await this.adminFormRepo.toggleQuestionsMandatory({ formId, mandatory });
    }

    async getDeleteDependencies({ formId, questionId }: { formId: number, questionId: number }): Promise<ResEither<AppError, DeleteQuestionDependencies>> {
        return await this.adminFormRepo.getDeleteDependencies({ formId, questionId });
    }


    async queryFormsToCompare(req: QueryFormsToCompareReq): Promise<ResEither<AppError, QueryFormsToCompareRes>> {
        return await this.adminFormRepo.queryFormsToCompare(req);
    }

    async queryComparisionMetaData(formId: number): Promise<ResEither<AppError, FormCompareMetaData>> {
        return await this.adminFormRepo.queryComparisionMetaData(formId);
    }

    async getFormCompareDetails(formAId: number, formBId: number, restrictAutoOrganize: boolean): Promise<ResEither<AppError, FormCompareDetails>> {
        return await this.adminFormRepo.getFormCompareDetails(formAId, formBId, restrictAutoOrganize);
    }

    async getComparisonOverview(req: FormComparisonOverviewReq): Promise<ResEither<AppError, FormComparisonOverview>> {
        return await this.adminFormRepo.getComparisonOverview(req);
    }

    async getComparisonUserList(req: FormCompareUserListReq): Promise<ResEither<AppError, FormCompareUserList>> {
        return await this.adminFormRepo.getComparisonUserList(req);
    }

    async saveTranslation(req: SaveTranslationReq): Promise<ResEither<AppError, void>> {
        return await this.adminFormRepo.saveTranslation(req);
    }

    async getTranslation(formId: number, languageId: string): Promise<ResEither<AppError, FormTranslation>> {
        return await this.adminFormRepo.getTranslation(formId, languageId);
    }

    async createNewForm(req: CreateNewReq): Promise<ResEither<AppError, AdminFormDetail>> {
        return await this.adminFormRepo.createNewForm(req);
    }

}