export class OrgPlanStatus {
    public readonly value: string;
    public readonly label: string;

    private constructor(value: string, label: string) {
        this.value = value;
        this.label = label;
    }

    static readonly PENDING = new OrgPlanStatus("pending", "Pending Activation");
    static readonly ACTIVE = new OrgPlanStatus("active", "Active");
    static readonly EXPIRED = new OrgPlanStatus("expired", "Expired");
    static readonly CANCELED = new OrgPlanStatus("canceled", "Canceled");

    static fromValue(value: string): OrgPlanStatus {
        switch (value) {
            case OrgPlanStatus.PENDING.value:
                return OrgPlanStatus.PENDING;
            case OrgPlanStatus.ACTIVE.value:
                return OrgPlanStatus.ACTIVE;
            case OrgPlanStatus.EXPIRED.value:
                return OrgPlanStatus.EXPIRED;
            case OrgPlanStatus.CANCELED.value:
                return OrgPlanStatus.CANCELED;
            default:
                throw new Error(`Unknown OrgPlanStatus value: ${value}`);
        }
    }

    static values(): OrgPlanStatus[] {
        return [
            OrgPlanStatus.PENDING,
            OrgPlanStatus.ACTIVE,
            OrgPlanStatus.EXPIRED,
            OrgPlanStatus.CANCELED,
        ];
    }
}
