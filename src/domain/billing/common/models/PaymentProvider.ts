export class PaymentProvider {
    static readonly RAZORPAY = new PaymentProvider("razorpay");

    private constructor(public readonly value: string) { }


    static fromValue(value: string): PaymentProvider | null {
        const normalized = value.toLowerCase();
        switch (normalized) {
            case PaymentProvider.RAZORPAY.value:
                return PaymentProvider.RAZORPAY;
            default:
                return null;
        }
    }

    static requiredFromValue(value: string): PaymentProvider {
        const gateway = PaymentProvider.fromValue(value);
        if (!gateway) {
            throw new Error(`Invalid PaymentGateway value: ${value}`);
        }
        return gateway;
    }
}
