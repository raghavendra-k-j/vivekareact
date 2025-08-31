import { JsonObj } from "~/core/types/Json";
import { BillingInterval } from "~/domain/common/models/BillingInterval";
import { PlanType } from "~/domain/common/models/PlanType";

export type PlanDetailProps = {
    id: number;
    name: string;
    description: string | null;

    planType: PlanType;
    billingInterval: BillingInterval;
    intervalCount: number;

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
};

export class PlanDetail {
    readonly id: number;
    readonly name: string;
    readonly description: string | null;

    readonly planType: PlanType;
    readonly billingInterval: BillingInterval;
    readonly intervalCount: number;

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

    constructor(props: PlanDetailProps) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description ?? null;

        this.planType = props.planType;
        this.billingInterval = props.billingInterval;
        this.intervalCount = props.intervalCount;

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
    }

    static fromJson(json: JsonObj): PlanDetail {
        return new PlanDetail({
            id: json.id,
            name: json.name,
            description: json.description ?? null,

            planType: PlanType.fromValue(json.planType),
            billingInterval: BillingInterval.fromValue(json.billingInterval),
            intervalCount: json.intervalCount,

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
        });
    }
}