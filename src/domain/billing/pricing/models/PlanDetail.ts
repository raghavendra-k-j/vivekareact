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
    }

    static fromJson(json: JsonObj): PlanDetail {
        return new PlanDetail({
            id: Number(json.id),
            name: String(json.name),
            description: json.description == null ? null : String(json.description),

            planType: PlanType.fromValue(String(json.planType)),
            billingInterval: BillingInterval.fromValue(String(json.billingInterval)),
            intervalCount: Number(json.intervalCount),

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
        });
    }
}
