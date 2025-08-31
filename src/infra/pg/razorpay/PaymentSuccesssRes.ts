import { JsonObj } from "~/core/types/Json";


export type PaymentSuccessResProps = {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
}

export class PaymentSuccessRes {

    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;

    constructor(props: PaymentSuccessResProps) {
        this.razorpayPaymentId = props.razorpayPaymentId;
        this.razorpayOrderId = props.razorpayOrderId;
        this.razorpaySignature = props.razorpaySignature;
    }

    toJson(): JsonObj {
        return {
            razorpayPaymentId: this.razorpayPaymentId,
            razorpayOrderId: this.razorpayOrderId,
            razorpaySignature: this.razorpaySignature,
        };
    }

    static fromRazorpayJson(json: JsonObj): PaymentSuccessRes {
        return new PaymentSuccessRes({
            razorpayPaymentId: json.razorpay_payment_id,
            razorpayOrderId: json.razorpay_order_id,
            razorpaySignature: json.razorpay_signature,
        });
    }


}



