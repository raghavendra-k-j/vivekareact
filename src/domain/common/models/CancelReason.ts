export class CancelReason {
  public readonly value: string;
  public readonly label: string;

  private constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }

  static readonly ORDER_CANCELLED = new CancelReason("order_cancelled", "Order Cancelled");
  static readonly PLAN_CHANGED = new CancelReason("plan_changed", "Plan Changed");

  static fromValue(value: string): CancelReason {
    switch (value.toLowerCase()) {
      case CancelReason.ORDER_CANCELLED.value:
        return CancelReason.ORDER_CANCELLED;
      case CancelReason.PLAN_CHANGED.value:
        return CancelReason.PLAN_CHANGED;
      default:
        throw new Error(`Unknown CancelReason: ${value}`);
    }
  }

  static values(): CancelReason[] {
    return [CancelReason.ORDER_CANCELLED, CancelReason.PLAN_CHANGED];
  }
}
