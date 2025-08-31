import { JsonObj } from "~/core/types/Json";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { FormStatus } from "~/domain/forms/models/FormStatus";
import { FormType } from "~/domain/forms/models/FormType";

export type FormCompareDetailProps = {
    id: number;
    type: FormType;
    permalink: string;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    title: string;

    createdAt: Date;
    startDate: Date | null;
    endDate: Date | null;

    totalQuestions: number;
    totalMarks: number;
    passingMarks: number | null;
    timeLimit: number | null;

    totalResponses: number;
}

export class FormCompareDetail {

    id: number;
    type: FormType;
    permalink: string;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    title: string;


    createdAt: Date;
    startDate: Date | null;
    endDate: Date | null;

    totalQuestions: number;
    totalMarks: number;
    passingMarks: number | null;
    timeLimit: number | null;

    totalResponses: number;

    get hasPassingMarks(): boolean {
        return this.passingMarks !== null && this.passingMarks > 0;
    }


    constructor(params: FormCompareDetailProps) {
        this.id = params.id;
        this.type = params.type;
        this.permalink = params.permalink;
        this.status = params.status;
        this.adminFormStatus = params.adminFormStatus;
        this.title = params.title;
        this.createdAt = params.createdAt;
        this.startDate = params.startDate;
        this.endDate = params.endDate;
        this.totalQuestions = params.totalQuestions;
        this.totalMarks = params.totalMarks;
        this.passingMarks = params.passingMarks;
        this.timeLimit = params.timeLimit;
        this.totalResponses = params.totalResponses;
    }

    static fromJson({json, now}: {json: JsonObj, now: Date}): FormCompareDetail {
        const status = FormStatus.fromValue(json.status)!;
        const startDate = json.startDate ? new Date(json.startDate) : null;
        const endDate = json.endDate ? new Date(json.endDate) : null;
        const adminFormStatus = AdminFormStatus.fromDbStatus({
            dbStatus: status,
            now: now,
            startDate: startDate,
            endDate: endDate
        });

        return new FormCompareDetail({
            id: json.id,
            type: FormType.fromType(json.type)!,
            permalink: json.permalink,
            status: status,
            adminFormStatus: adminFormStatus,
            title: json.title,
            createdAt: new Date(json.createdAt),
            startDate: startDate,
            endDate: endDate,
            totalQuestions: json.totalQuestions,
            totalMarks: json.totalMarks,
            passingMarks: json.passingMarks,
            timeLimit: json.timeLimit,
            totalResponses: json.totalResponses
        });
    }
}