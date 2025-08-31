export class PlanType {
    public readonly type: string;
    public readonly label: string;

    private constructor(type: string, label: string) {
        this.type = type;
        this.label = label;
    }

    static readonly TRIAL = new PlanType("trial", "Free Trial");
    static readonly STANDARD = new PlanType("standard", "Standard Plan");
    static readonly CUSTOM = new PlanType("custom", "Custom Plan");

    static fromValue(type: string): PlanType {
        switch (type.toLowerCase()) {
            case PlanType.TRIAL.type:
                return PlanType.TRIAL;
            case PlanType.STANDARD.type:
                return PlanType.STANDARD;
            case PlanType.CUSTOM.type:
                return PlanType.CUSTOM;
            default:
                throw new Error(`Unknown OrgPlanType: ${type}`);
        }
    }

    static values(): PlanType[] {
        return [PlanType.TRIAL, PlanType.STANDARD, PlanType.CUSTOM];
    }
}
