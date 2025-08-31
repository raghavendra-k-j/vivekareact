import { JsonObj } from "~/core/types/Json";

export type OrgUsageDetailProps = {
    orgId: number;
    usersCount: number;

    formsAiGenPlanUnitsRemaining: number;
    formsAiGenAddonUnitsRemaining: number;

    formsAiTransPlanUnitsRemaining: number;
    formsAiTransAddonUnitsRemaining: number;

    formsAiEvaluationPlanUnitsRemaining: number;
    formsAiEvaluationAddonUnitsRemaining: number;

    summarizerSummariesPlanRemaining: number;
    summarizerSummariesAddonRemaining: number;

    updatedAt: Date;
};

export class OrgUsageDetail {
    readonly orgId: number;
    readonly usersCount: number;

    readonly formsAiGenPlanUnitsRemaining: number;
    readonly formsAiGenAddonUnitsRemaining: number;

    readonly formsAiTransPlanUnitsRemaining: number;
    readonly formsAiTransAddonUnitsRemaining: number;

    readonly formsAiEvaluationPlanUnitsRemaining: number;
    readonly formsAiEvaluationAddonUnitsRemaining: number;

    readonly summarizerSummariesPlanRemaining: number;
    readonly summarizerSummariesAddonRemaining: number;

    readonly updatedAt: Date;

    constructor(props: OrgUsageDetailProps) {
        this.orgId = props.orgId;
        this.usersCount = props.usersCount;

        this.formsAiGenPlanUnitsRemaining = props.formsAiGenPlanUnitsRemaining;
        this.formsAiGenAddonUnitsRemaining = props.formsAiGenAddonUnitsRemaining;

        this.formsAiTransPlanUnitsRemaining = props.formsAiTransPlanUnitsRemaining;
        this.formsAiTransAddonUnitsRemaining = props.formsAiTransAddonUnitsRemaining;

        this.formsAiEvaluationPlanUnitsRemaining = props.formsAiEvaluationPlanUnitsRemaining;
        this.formsAiEvaluationAddonUnitsRemaining = props.formsAiEvaluationAddonUnitsRemaining;

        this.summarizerSummariesPlanRemaining = props.summarizerSummariesPlanRemaining;
        this.summarizerSummariesAddonRemaining = props.summarizerSummariesAddonRemaining;

        this.updatedAt = props.updatedAt;
    }

    get formsAiGenUnitsRemaining(): number {
        return this.formsAiGenPlanUnitsRemaining + this.formsAiGenAddonUnitsRemaining;
    }

    get formsAiTransUnitsRemaining(): number {
        return this.formsAiTransPlanUnitsRemaining + this.formsAiTransAddonUnitsRemaining;
    }

    get formsAiEvaluationUnitsRemaining(): number {
        return this.formsAiEvaluationPlanUnitsRemaining + this.formsAiEvaluationAddonUnitsRemaining;
    }

    get summarizerSummariesRemaining(): number {
        return this.summarizerSummariesPlanRemaining + this.summarizerSummariesAddonRemaining;
    }

    static fromJson(json: JsonObj): OrgUsageDetail {
        return new OrgUsageDetail({
            orgId: json.orgId,
            usersCount: json.usersCount,

            formsAiGenPlanUnitsRemaining: json.formsAiGenPlanUnitsRemaining ?? 0,
            formsAiGenAddonUnitsRemaining: json.formsAiGenAddonUnitsRemaining ?? 0,

            formsAiTransPlanUnitsRemaining: json.formsAiTransPlanUnitsRemaining ?? 0,
            formsAiTransAddonUnitsRemaining: json.formsAiTransAddonUnitsRemaining ?? 0,

            formsAiEvaluationPlanUnitsRemaining: json.formsAiEvaluationPlanUnitsRemaining ?? 0,
            formsAiEvaluationAddonUnitsRemaining: json.formsAiEvaluationAddonUnitsRemaining ?? 0,

            summarizerSummariesPlanRemaining: json.summarizerSummariesPlanRemaining ?? 0,
            summarizerSummariesAddonRemaining: json.summarizerSummariesAddonRemaining ?? 0,

            updatedAt: new Date(json.updatedAt),
        });
    }
}
