export class OrderStatus {
    static readonly INITIATED = new OrderStatus("Initiated", "initiated");
    static readonly CREATED = new OrderStatus("Created", "created");
    static readonly PAID = new OrderStatus("Paid", "paid");
    static readonly CANCELLED = new OrderStatus("Cancelled", "cancelled");
    static readonly REFUNDED = new OrderStatus("Refunded", "refunded");
    static readonly FAILED = new OrderStatus("Failed", "failed");

    private static readonly VALUES = [
        OrderStatus.INITIATED,
        OrderStatus.CREATED,
        OrderStatus.PAID,
        OrderStatus.CANCELLED,
        OrderStatus.REFUNDED,
        OrderStatus.FAILED,
    ];

    private constructor(
        public readonly label: string,
        public readonly value: string
    ) { }

    static fromValue(value: string): OrderStatus | null {
        if (value != null) value = value.toLowerCase();
        for (const status of OrderStatus.VALUES) {
            if (status.value === value) {
                return status;
            }
        }
        return null;
    }

    static requiredFromValue(value: string): OrderStatus {
        const status = OrderStatus.fromValue(value);
        if (!status) {
            throw new Error(`Invalid OrderStatus value: ${value}`);
        }
        return status;
    }
}
