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

    spacesFeatureEnabled: boolean;
    spacesLimit: number;
    spacesMaxMembersPerSpace: number;
    spacesMaxTopicsPerSpace: number;
    spacesMaxFormsPerSpace: number;

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

    readonly spacesFeatureEnabled: boolean;
    readonly spacesLimit: number;
    readonly spacesMaxMembersPerSpace: number;
    readonly spacesMaxTopicsPerSpace: number;
    readonly spacesMaxFormsPerSpace: number;

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

        this.spacesFeatureEnabled = props.spacesFeatureEnabled;
        this.spacesLimit = props.spacesLimit;
        this.spacesMaxMembersPerSpace = props.spacesMaxMembersPerSpace;
        this.spacesMaxTopicsPerSpace = props.spacesMaxTopicsPerSpace;
        this.spacesMaxFormsPerSpace = props.spacesMaxFormsPerSpace;

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

            creditsCarryOver: json.creditsCarryOver,

            usersLimit: json.usersLimit,

            formsLimit: json.formsLimit,
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

            spacesFeatureEnabled: json.spacesFeatureEnabled,
            spacesLimit: json.spacesLimit,
            spacesMaxMembersPerSpace: json.spacesMaxMembersPerSpace,
            spacesMaxTopicsPerSpace: json.spacesMaxTopicsPerSpace,
            spacesMaxFormsPerSpace: json.spacesMaxFormsPerSpace,

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