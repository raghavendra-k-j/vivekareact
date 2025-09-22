import { JsonObj } from "~/core/types/Json";

export type OrgUsageDetailProps = {
    orgId: number;
    usersCount: number;

    formsCount: number;
    formsAiGenPlanUnitsRemaining: number;
    formsAiGenAddonUnitsRemaining: number;

    formsAiTransPlanUnitsRemaining: number;
    formsAiTransAddonUnitsRemaining: number;

    formsAiEvaluationPlanUnitsRemaining: number;
    formsAiEvaluationAddonUnitsRemaining: number;

    lmsFoldersCount: number;
    lmsCoursesCount: number;

    lmsAiStructureGenPlanUnitsRemaining: number;
    lmsAiStructureGenAddonUnitsRemaining: number;

    summarizerSummariesPlanRemaining: number;
    summarizerSummariesAddonRemaining: number;

    updatedAt: Date;
};

export class OrgUsageDetail {
    readonly orgId: number;
    readonly usersCount: number;

    readonly formsCount: number;
    readonly formsAiGenPlanUnitsRemaining: number;
    readonly formsAiGenAddonUnitsRemaining: number;

    readonly formsAiTransPlanUnitsRemaining: number;
    readonly formsAiTransAddonUnitsRemaining: number;

    readonly formsAiEvaluationPlanUnitsRemaining: number;
    readonly formsAiEvaluationAddonUnitsRemaining: number;

    readonly lmsFoldersCount: number;
    readonly lmsCoursesCount: number;

    readonly lmsAiStructureGenPlanUnitsRemaining: number;
    readonly lmsAiStructureGenAddonUnitsRemaining: number;

    readonly summarizerSummariesPlanRemaining: number;
    readonly summarizerSummariesAddonRemaining: number;

    readonly updatedAt: Date;

    constructor(props: OrgUsageDetailProps) {
        this.orgId = props.orgId;
        this.usersCount = props.usersCount;

        this.formsCount = props.formsCount;
        this.formsAiGenPlanUnitsRemaining = props.formsAiGenPlanUnitsRemaining;
        this.formsAiGenAddonUnitsRemaining = props.formsAiGenAddonUnitsRemaining;

        this.formsAiTransPlanUnitsRemaining = props.formsAiTransPlanUnitsRemaining;
        this.formsAiTransAddonUnitsRemaining = props.formsAiTransAddonUnitsRemaining;

        this.formsAiEvaluationPlanUnitsRemaining = props.formsAiEvaluationPlanUnitsRemaining;
        this.formsAiEvaluationAddonUnitsRemaining = props.formsAiEvaluationAddonUnitsRemaining;

        this.lmsFoldersCount = props.lmsFoldersCount;
        this.lmsCoursesCount = props.lmsCoursesCount;

        this.lmsAiStructureGenPlanUnitsRemaining = props.lmsAiStructureGenPlanUnitsRemaining;
        this.lmsAiStructureGenAddonUnitsRemaining = props.lmsAiStructureGenAddonUnitsRemaining;

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

    get lmsAiStructureGenUnitsRemaining(): number {
        return this.lmsAiStructureGenPlanUnitsRemaining + this.lmsAiStructureGenAddonUnitsRemaining;
    }

    get summarizerSummariesRemaining(): number {
        return this.summarizerSummariesPlanRemaining + this.summarizerSummariesAddonRemaining;
    }

    static fromJson(json: JsonObj): OrgUsageDetail {
        return new OrgUsageDetail({
            orgId: Number(json.orgId),
            usersCount: Number(json.usersCount),

            formsCount: Number(json.formsCount),
            formsAiGenPlanUnitsRemaining: Number(json.formsAiGenPlanUnitsRemaining),
            formsAiGenAddonUnitsRemaining: Number(json.formsAiGenAddonUnitsRemaining),

            formsAiTransPlanUnitsRemaining: Number(json.formsAiTransPlanUnitsRemaining),
            formsAiTransAddonUnitsRemaining: Number(json.formsAiTransAddonUnitsRemaining),

            formsAiEvaluationPlanUnitsRemaining: Number(json.formsAiEvaluationPlanUnitsRemaining),
            formsAiEvaluationAddonUnitsRemaining: Number(json.formsAiEvaluationAddonUnitsRemaining),

            lmsFoldersCount: Number(json.lmsFoldersCount),
            lmsCoursesCount: Number(json.lmsCoursesCount),

            lmsAiStructureGenPlanUnitsRemaining: Number(json.lmsAiStructureGenPlanUnitsRemaining),
            lmsAiStructureGenAddonUnitsRemaining: Number(json.lmsAiStructureGenAddonUnitsRemaining),

            summarizerSummariesPlanRemaining: Number(json.summarizerSummariesPlanRemaining),
            summarizerSummariesAddonRemaining: Number(json.summarizerSummariesAddonRemaining),

            updatedAt: new Date(String(json.updatedAt)),
        });
    }
}
