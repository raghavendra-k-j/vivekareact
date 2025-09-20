import { AdminFormDetail } from "~/domain/forms/admin/models/AdminFormDetail";
import { AssmntTypeRefItem } from "~/domain/forms/admin/models/AssmntTypeRefItem";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { AssmntDomain } from "~/domain/forms/models/AssmntDomain";
import { AssmntType } from "~/domain/forms/models/AssmntType";
import { FormStatus } from "~/domain/forms/models/FormStatus";
import { FormType } from "~/domain/forms/models/FormType";
import { FormUser } from "~/domain/forms/models/FormUser";
import { FormVisibility } from "~/domain/forms/models/FormVisibility";
import { Language } from "~/domain/forms/models/Language";

export type AdminFormDetailVmProps = {
    id: number;
    type: FormType;
    permalink: string;
    orgId: number;
    shortLink: string;
    creator: FormUser;
    updatedBy: FormUser;
    createdAt: Date;
    updatedAt: Date;
    status: FormStatus;
    language: Language | null;
    languages: Language[];
    verifyGuestEmail: boolean | null;
    title: string;
    description: string | null;
    tags: string[];
    startDate: Date | null;
    endDate: Date | null;
    timeLimit: number | null;
    totalQuestions: number;
    totalMarks: number | null;
    passingMarks: number | null;
    assessmentType: AssmntType | null;
    assmntTypeRef: AssmntTypeRefItem | null;
    assmntDomain: AssmntDomain | null;
    shuffle: boolean | null;
    visibility: FormVisibility;
    hold4ManualEval: boolean | null;
    evalOeQsWtAi: boolean | null;
    totalViews: number;
    totalInvites: number;
    totalResponses: number;
}

export class AdminFormDetailVm {
    public readonly id: number;
    public readonly type: FormType;
    public readonly permalink: string;
    public readonly orgId: number;
    public readonly shortLink: string;
    public readonly creator: FormUser;
    public readonly updatedBy: FormUser;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly status: FormStatus;
    public readonly adminFormStatus: AdminFormStatus;
    public readonly language: Language | null;
    public readonly languages: Language[];
    public readonly verifyGuestEmail: boolean | null;
    public readonly title: string;
    public readonly description: string | null;
    public readonly tags: string[];
    public readonly startDate: Date | null;
    public readonly endDate: Date | null;
    public readonly timeLimit: number | null;
    public readonly totalQuestions: number;
    public readonly totalMarks: number | null;
    public readonly passingMarks: number | null;
    public readonly assessmentType: AssmntType | null;
    public readonly assmntTypeRef: AssmntTypeRefItem | null;
    public readonly assmntDomain: AssmntDomain | null;
    public readonly shuffle: boolean | null;
    public readonly visibility: FormVisibility | null;
    public readonly hold4ManualEval: boolean | null;
    public readonly evalOeQsWtAi: boolean | null;
    public readonly totalViews: number;
    public readonly totalInvites: number;
    public readonly totalResponses: number;


    constructor(props: AdminFormDetailVmProps) {
        this.id = props.id;
        this.type = props.type;
        this.permalink = props.permalink;
        this.orgId = props.orgId;
        this.shortLink = props.shortLink;
        this.creator = props.creator;
        this.updatedBy = props.updatedBy;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.status = props.status;
        this.language = props.language;
        this.languages = props.languages;
        this.verifyGuestEmail = props.verifyGuestEmail;
        this.title = props.title;
        this.description = props.description;
        this.tags = props.tags;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.timeLimit = props.timeLimit;
        this.totalQuestions = props.totalQuestions;
        this.totalMarks = props.totalMarks;
        this.passingMarks = props.passingMarks;
        this.assessmentType = props.assessmentType;
        this.assmntTypeRef = props.assmntTypeRef;
        this.assmntDomain = props.assmntDomain;
        this.shuffle = props.shuffle;
        this.visibility = props.visibility;
        this.hold4ManualEval = props.hold4ManualEval;
        this.evalOeQsWtAi = props.evalOeQsWtAi;
        this.totalViews = props.totalViews;
        this.totalInvites = props.totalInvites;
        this.totalResponses = props.totalResponses;
        this.adminFormStatus = AdminFormStatus.fromDbStatus({
            dbStatus: this.status,
            startDate: this.startDate,
            endDate: this.endDate,
            now: new Date(),
        });
    }

    get isSurvey() {
        return this.type === FormType.Survey;
    }

    get isAssessment() {
        return this.type === FormType.Assessment;
    }

    static fromModel(model: AdminFormDetail): AdminFormDetailVm {
        return new AdminFormDetailVm({
            id: model.id,
            type: model.type,
            permalink: model.permalink,
            orgId: model.orgId,
            shortLink: model.shortLink,
            creator: model.creator,
            updatedBy: model.updatedBy,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            status: model.status,
            language: model.language,
            languages: model.languages,
            verifyGuestEmail: model.verifyGuestEmail,
            title: model.title,
            description: model.description,
            tags: model.tags,
            startDate: model.startDate,
            endDate: model.endDate,
            timeLimit: model.timeLimit,
            totalQuestions: model.totalQuestions,
            totalMarks: model.totalMarks,
            passingMarks: model.passingMarks,
            assessmentType: model.assessmentType,
            assmntTypeRef: model.assmntTypeRef,
            assmntDomain: model.assmntDomain,
            shuffle: model.shuffle,
            visibility: model.visibility,
            hold4ManualEval: model.hold4ManualEval,
            evalOeQsWtAi: model.evalOeQsWtAi,
            totalViews: model.totalViews,
            totalInvites: model.totalInvites,
            totalResponses: model.totalResponses,
        });
    }
}