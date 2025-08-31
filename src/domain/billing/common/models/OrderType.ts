export class OrderType {
    static readonly PLAN = new OrderType("Plan", "plan");
    static readonly TOPUP = new OrderType("Top Up", "topup");

    private constructor(
        public readonly label: string,
        public readonly value: string
    ) {
        Object.freeze(this);
    }

    static fromValue(value: string): OrderType | null {
        const normalized = value.toLowerCase();
        switch (normalized) {
            case OrderType.PLAN.value:
                return OrderType.PLAN;
            case OrderType.TOPUP.value:
                return OrderType.TOPUP;
            default:
                return null;
        }
    }

    static requiredFromValue(value: string): OrderType {
        const orderType = OrderType.fromValue(value);
        if (!orderType) {
            throw new Error(`Invalid OrderType value: ${value}`);
        }
        return orderType;
    }
}
