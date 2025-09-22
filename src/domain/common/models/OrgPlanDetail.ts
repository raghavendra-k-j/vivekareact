import { JsonObj } from "~/core/types/Json";
import { ActivationMethod } from "./ActivationMethod";
import { CancelReason } from "./CancelReason";
import { OrgPlanStatus } from "./OrgPlanStatus";
import { PlanType } from "./PlanType";

export type OrgPlanDetailProps = {
    id: number;
    orgId: number;
    orderId: number | null;
    planId: number | null;
    planPriceId: number | null;
    planType: PlanType;
    name: string;

    creditsCarryOver: boolean;
    usersLimit: number;

    formsLimit: number;
    formsAiGenUnits: number;
    formsAiTransUnits: number;
    formsAiEvaluationUnits: number;

    formsAiGenMaxFileSize: number;
    formsImageMaxFileSize: number;
    formsVideoMaxFileSize: number;
    formsAiGenMaxContextChars: number;
    formsAiMaxQuestions: number;
    formsAiEqnAdminEnabled: boolean;
    formsAiEqnUserEnabled: boolean;

    lmsFeatureEnabled: boolean;
    lmsMaxFolders: number;
    lmsMaxCourses: number;
    lmsMaxMembersPerCourse: number;
    lmsMaxTopicsPerCourse: number;
    lmsAiStructureGenUnits: number;
    lmsMaxFormsPerCourse: number;

    summarizerSummaries: number;
    summarizerMaxFileSize: number;
    summarizerMaxContextChars: number;
    summarizerMaxWords: number;

    lrMaxFileSize: number;
    qpFeatureEnabled: boolean;
    qpAiGenMaxFileSize: number;

    status: OrgPlanStatus;
    startsAt: Date | null;
    endsAt: Date | null;
    activatedAt: Date | null;
    activationMethod: ActivationMethod | null;
    activatedByUserId: number | null;
    canceledAt: Date | null;
    cancelReason: CancelReason | null;

    createdAt: Date;
    updatedAt: Date;
};

export class OrgPlanDetail {
    readonly id: number;
    readonly orgId: number;
    readonly orderId: number | null;
    readonly planId: number | null;
    readonly planPriceId: number | null;
    readonly planType: PlanType;
    readonly name: string;

    readonly creditsCarryOver: boolean;

    readonly usersLimit: number;

    readonly formsLimit: number;
    readonly formsAiGenUnits: number;
    readonly formsAiTransUnits: number;
    readonly formsAiEvaluationUnits: number;

    readonly formsAiGenMaxFileSize: number;
    readonly formsImageMaxFileSize: number;
    readonly formsVideoMaxFileSize: number;
    readonly formsAiGenMaxContextChars: number;
    readonly formsAiMaxQuestions: number;
    readonly formsAiEqnAdminEnabled: boolean;
    readonly formsAiEqnUserEnabled: boolean;

    readonly lmsFeatureEnabled: boolean;
    readonly lmsMaxFolders: number;
    readonly lmsMaxCourses: number;
    readonly lmsMaxMembersPerCourse: number;
    readonly lmsMaxTopicsPerCourse: number;
    readonly lmsAiStructureGenUnits: number;
    readonly lmsMaxFormsPerCourse: number;

    readonly summarizerSummaries: number;
    readonly summarizerMaxFileSize: number;
    readonly summarizerMaxContextChars: number;
    readonly summarizerMaxWords: number;

    readonly lrMaxFileSize: number;
    readonly qpFeatureEnabled: boolean;
    readonly qpAiGenMaxFileSize: number;

    readonly status: OrgPlanStatus;
    readonly startsAt: Date | null;
    readonly endsAt: Date | null;
    readonly activatedAt: Date | null;
    readonly activationMethod: ActivationMethod | null;
    readonly activatedByUserId: number | null;
    readonly canceledAt: Date | null;
    readonly cancelReason: CancelReason | null;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(props: OrgPlanDetailProps) {
        this.id = props.id;
        this.orgId = props.orgId;
        this.orderId = props.orderId;
        this.planId = props.planId;
        this.planPriceId = props.planPriceId;
        this.planType = props.planType;
        this.name = props.name;

        this.creditsCarryOver = props.creditsCarryOver;

        this.usersLimit = props.usersLimit;

        this.formsLimit = props.formsLimit;
        this.formsAiGenUnits = props.formsAiGenUnits;
        this.formsAiTransUnits = props.formsAiTransUnits;
        this.formsAiEvaluationUnits = props.formsAiEvaluationUnits;

        this.formsAiGenMaxFileSize = props.formsAiGenMaxFileSize;
        this.formsImageMaxFileSize = props.formsImageMaxFileSize;
        this.formsVideoMaxFileSize = props.formsVideoMaxFileSize;
        this.formsAiGenMaxContextChars = props.formsAiGenMaxContextChars;
        this.formsAiMaxQuestions = props.formsAiMaxQuestions;
        this.formsAiEqnAdminEnabled = props.formsAiEqnAdminEnabled;
        this.formsAiEqnUserEnabled = props.formsAiEqnUserEnabled;

        this.lmsFeatureEnabled = props.lmsFeatureEnabled;
        this.lmsMaxFolders = props.lmsMaxFolders;
        this.lmsMaxCourses = props.lmsMaxCourses;
        this.lmsMaxMembersPerCourse = props.lmsMaxMembersPerCourse;
        this.lmsMaxTopicsPerCourse = props.lmsMaxTopicsPerCourse;
        this.lmsAiStructureGenUnits = props.lmsAiStructureGenUnits;
        this.lmsMaxFormsPerCourse = props.lmsMaxFormsPerCourse;

        this.summarizerSummaries = props.summarizerSummaries;
        this.summarizerMaxFileSize = props.summarizerMaxFileSize;
        this.summarizerMaxContextChars = props.summarizerMaxContextChars;
        this.summarizerMaxWords = props.summarizerMaxWords;

        this.lrMaxFileSize = props.lrMaxFileSize;
        this.qpFeatureEnabled = props.qpFeatureEnabled;
        this.qpAiGenMaxFileSize = props.qpAiGenMaxFileSize;

        this.status = props.status;
        this.startsAt = props.startsAt;
        this.endsAt = props.endsAt;
        this.activatedAt = props.activatedAt;
        this.activationMethod = props.activationMethod;
        this.activatedByUserId = props.activatedByUserId;
        this.canceledAt = props.canceledAt;
        this.cancelReason = props.cancelReason;

        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static fromJson(json: JsonObj): OrgPlanDetail {
        return new OrgPlanDetail({
            id: Number(json.id),
            orgId: Number(json.orgId),
            orderId: json.orderId == null ? null : Number(json.orderId),
            planId: json.planId == null ? null : Number(json.planId),
            planPriceId: json.planPriceId == null ? null : Number(json.planPriceId),
            planType: PlanType.fromValue(String(json.planType)),
            name: String(json.name),

            creditsCarryOver: Boolean(json.creditsCarryOver),
            usersLimit: Number(json.usersLimit),

            formsLimit: Number(json.formsLimit),
            formsAiGenUnits: Number(json.formsAiGenUnits),
            formsAiTransUnits: Number(json.formsAiTransUnits),
            formsAiEvaluationUnits: Number(json.formsAiEvaluationUnits),

            formsAiGenMaxFileSize: Number(json.formsAiGenMaxFileSize),
            formsImageMaxFileSize: Number(json.formsImageMaxFileSize),
            formsVideoMaxFileSize: Number(json.formsVideoMaxFileSize),
            formsAiGenMaxContextChars: Number(json.formsAiGenMaxContextChars),
            formsAiMaxQuestions: Number(json.formsAiMaxQuestions),
            formsAiEqnAdminEnabled: Boolean(json.formsAiEqnAdminEnabled),
            formsAiEqnUserEnabled: Boolean(json.formsAiEqnUserEnabled),

            lmsFeatureEnabled: Boolean(json.lmsFeatureEnabled),
            lmsMaxFolders: Number(json.lmsMaxFolders),
            lmsMaxCourses: Number(json.lmsMaxCourses),
            lmsMaxMembersPerCourse: Number(json.lmsMaxMembersPerCourse),
            lmsMaxTopicsPerCourse: Number(json.lmsMaxTopicsPerCourse),
            lmsAiStructureGenUnits: Number(json.lmsAiStructureGenUnits),
            lmsMaxFormsPerCourse: Number(json.lmsMaxFormsPerCourse),

            summarizerSummaries: Number(json.summarizerSummaries),
            summarizerMaxFileSize: Number(json.summarizerMaxFileSize),
            summarizerMaxContextChars: Number(json.summarizerMaxContextChars),
            summarizerMaxWords: Number(json.summarizerMaxWords),

            lrMaxFileSize: Number(json.lrMaxFileSize),
            qpFeatureEnabled: Boolean(json.qpFeatureEnabled),
            qpAiGenMaxFileSize: Number(json.qpAiGenMaxFileSize),

            status: OrgPlanStatus.fromValue(String(json.status)),
            startsAt: json.startsAt == null ? null : new Date(String(json.startsAt)),
            endsAt: json.endsAt == null ? null : new Date(String(json.endsAt)),
            activatedAt: json.activatedAt == null ? null : new Date(String(json.activatedAt)),
            activationMethod: json.activationMethod == null ? null : ActivationMethod.fromValue(String(json.activationMethod)),
            activatedByUserId: json.activatedByUserId == null ? null : Number(json.activatedByUserId),
            canceledAt: json.canceledAt == null ? null : new Date(String(json.canceledAt)),
            cancelReason: json.cancelReason == null ? null : CancelReason.fromValue(String(json.cancelReason)),

            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt)),
        });
    }
}