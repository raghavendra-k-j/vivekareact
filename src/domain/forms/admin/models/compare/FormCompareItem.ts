import { JsonObj } from "~/core/types/Json";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { AssmntType } from "~/domain/forms/models/AssmntType";
import { FormStatus } from "~/domain/forms/models/FormStatus";
import { FormType } from "~/domain/forms/models/FormType";

export type FormCompareItemProps = {
    id: number;
    type: FormType;
    permalink: string;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    title: string;
    createdAt: Date;
    startDate: Date | null;
    endDate: Date | null;
    assessmentType: AssmntType | null;
    totalQuestions: number;
    totalMarks: number;
    totalResponses: number;
}

export class FormCompareItem {
    id: number;
    type: FormType;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    permalink: string;
    title: string;
    createdAt: Date;
    startDate: Date | null;
    endDate: Date | null;
    assessmentType: AssmntType | null;
    totalQuestions: number;
    totalMarks: number;
    totalResponses: number;

    constructor(params: FormCompareItemProps) {
        this.id = params.id;
        this.type = params.type;
        this.status = params.status;
        this.adminFormStatus = params.adminFormStatus;
        this.permalink = params.permalink;
        this.title = params.title;
        this.createdAt = params.createdAt;
        this.startDate = params.startDate;
        this.endDate = params.endDate;
        this.assessmentType = params.assessmentType;
        this.totalQuestions = params.totalQuestions;
        this.totalMarks = params.totalMarks;
        this.totalResponses = params.totalResponses;
    }

    static fromJson({ json, now }: { json: JsonObj, now: Date }): FormCompareItem {
        const status = FormStatus.fromValue(json.status)!;
        const startDate = json.startDate ? new Date(json.startDate) : null;
        const endDate = json.endDate ? new Date(json.endDate) : null;
        const adminFormStatus = AdminFormStatus.fromDbStatus({
            dbStatus: status,
            now: now,
            startDate: startDate,
            endDate: endDate
        });
        const assessmentType = AssmntType.fromType(json.assessmentType) ?? null;
        return new FormCompareItem({
            id: json.id,
            type: FormType.fromType(json.type)!,
            status: status,
            adminFormStatus: adminFormStatus,
            permalink: json.permalink,
            title: json.title,
            createdAt: new Date(json.createdAt),
            startDate: startDate,
            endDate: endDate,
            assessmentType: assessmentType,
            totalQuestions: json.totalQuestions,
            totalMarks: json.totalMarks,
            totalResponses: json.totalResponses,
        });
    }
}
