import { JsonObj } from "~/core/types/Json";
import { PlanType } from "./PlanType";
import { ActivationMethod } from "./ActivationMethod";
import { CancelReason } from "./CancelReason";
import { OrgPlanStatus } from "./OrgPlanStatus";

export type OrgPlanDetailProps = {
    id: number;
    orgId: number;
    orderId?: number;
    planId?: number;
    planPriceId?: number;
    planType: PlanType;
    name: string;

    usersLimit: number;
    creditsCarryOver: boolean;

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

    summarizerSummaries: number;
    summarizerMaxFileSize: number;
    summarizerMaxContextChars: number;
    summarizerMaxWords: number;

    lrMaxFileSize: number;
    qpFeatureEnabled: boolean;
    qpAiGenMaxFileSize: number;

    status: OrgPlanStatus;
    startsAt?: Date | null;
    endsAt?: Date | null;
    activatedAt?: Date | null;
    activationMethod?: ActivationMethod | null;
    activatedByUserId?: number | null;
    canceledAt?: Date | null;
    cancelReason?: CancelReason | null;

    createdAt: Date;
    updatedAt: Date;
};

export class OrgPlanDetail {
    readonly id: number;
    readonly orgId: number;
    readonly orderId?: number;
    readonly planId?: number;
    readonly planPriceId?: number;
    readonly planType: PlanType;
    readonly name: string;

    readonly usersLimit: number;
    readonly creditsCarryOver: boolean;

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

    readonly summarizerSummaries: number;
    readonly summarizerMaxFileSize: number;
    readonly summarizerMaxContextChars: number;
    readonly summarizerMaxWords: number;

    readonly lrMaxFileSize: number;
    readonly qpFeatureEnabled: boolean;
    readonly qpAiGenMaxFileSize: number;

    readonly status: OrgPlanStatus;
    readonly startsAt?: Date | null;
    readonly endsAt?: Date | null;
    readonly activatedAt?: Date | null;
    readonly activationMethod?: ActivationMethod | null;
    readonly activatedByUserId?: number | null;
    readonly canceledAt?: Date | null;
    readonly cancelReason?: CancelReason | null;

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

        this.usersLimit = props.usersLimit;
        this.creditsCarryOver = props.creditsCarryOver;

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
            id: json.id,
            orgId: json.orgId,
            orderId: json.orderId,
            planId: json.planId,
            planPriceId: json.planPriceId,
            planType: PlanType.fromValue(json.planType),
            name: json.name,

            usersLimit: json.usersLimit,
            creditsCarryOver: json.creditsCarryOver,

            formsAiGenUnits: json.formsAiGenUnits,
            formsAiTransUnits: json.formsAiTransUnits,
            formsAiEvaluationUnits: json.formsAiEvaluationUnits,

            formsAiGenMaxFileSize: json.formsAiGenMaxFileSize,
            formsImageMaxFileSize: json.formsImageMaxFileSize,
            formsVideoMaxFileSize: json.formsVideoMaxFileSize,
            formsAiGenMaxContextChars: json.formsAiGenMaxContextChars,
            formsAiMaxQuestions: json.formsAiMaxQuestions,
            formsAiEqnAdminEnabled: json.formsAiEqnAdminEnabled,
            formsAiEqnUserEnabled: json.formsAiEqnUserEnabled,

            summarizerSummaries: json.summarizerSummaries,
            summarizerMaxFileSize: json.summarizerMaxFileSize,
            summarizerMaxContextChars: json.summarizerMaxContextChars,
            summarizerMaxWords: json.summarizerMaxWords,

            lrMaxFileSize: json.lrMaxFileSize,
            qpFeatureEnabled: json.qpFeatureEnabled,
            qpAiGenMaxFileSize: json.qpAiGenMaxFileSize,

            status: OrgPlanStatus.fromValue(json.status),
            startsAt: json.startsAt ? new Date(json.startsAt) : null,
            endsAt: json.endsAt ? new Date(json.endsAt) : null,
            activatedAt: json.activatedAt ? new Date(json.activatedAt) : null,
            activationMethod: json.activationMethod ? ActivationMethod.fromValue(json.activationMethod) : null,
            activatedByUserId: json.activatedByUserId,
            canceledAt: json.canceledAt ? new Date(json.canceledAt) : null,
            cancelReason: json.cancelReason ? CancelReason.fromValue(json.cancelReason) : null,

            createdAt: new Date(json.createdAt),
            updatedAt: new Date(json.updatedAt),
        });
    }
}
