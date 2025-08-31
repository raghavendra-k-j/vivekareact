export class PaymentProcessor {

    label: string;
    value: string;

    constructor(label: string, value: string) {
        this.label = label;
        this.value = value;
    }

    static readonly PAYMENT_GATEWAY = new PaymentProcessor("Payment Gateway", "payment_gateway");
    static readonly MOR = new PaymentProcessor("Merchant of Record", "mor");

    static fromValue(value: string): PaymentProcessor | null {
        value = value.toLowerCase();
        switch(value) {
            case this.PAYMENT_GATEWAY.value:
                return this.PAYMENT_GATEWAY;
            case this.MOR.value:
                return this.MOR;
            default:
                return null;
        }
    }

    get isPaymentGateway() {
        return this.value === PaymentProcessor.PAYMENT_GATEWAY.value;
    }

    get isMor() {
        return this.value === PaymentProcessor.MOR.value;
    }


}