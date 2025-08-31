export class BillingInterval {
    private static readonly _values: BillingInterval[] = [];

    static readonly WEEK = new BillingInterval("Weekly", "week", "week");
    static readonly MONTH = new BillingInterval("Monthly", "month", "month");
    static readonly YEAR = new BillingInterval("Yearly", "year", "year");

    private static readonly VALUE_MAP: Map<string, BillingInterval> = new Map([
        [BillingInterval.WEEK.value, BillingInterval.WEEK],
        [BillingInterval.MONTH.value, BillingInterval.MONTH],
        [BillingInterval.YEAR.value, BillingInterval.YEAR],
    ]);

    readonly label: string;
    readonly value: string;
    readonly perLabel: string;

    private constructor(label: string, value: string, perLabel: string) {
        this.label = label;
        this.value = value;
        this.perLabel = perLabel;
        BillingInterval._values.push(this);
    }

    static fromValue(value: string): BillingInterval {
        value = value.toLowerCase();
        const interval = BillingInterval.VALUE_MAP.get(value);
        if (!interval) {
            throw new Error(`Unknown BillingInterval value: ${value}`);
        }
        return interval;
    }
}
