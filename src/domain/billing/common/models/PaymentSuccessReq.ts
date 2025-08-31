import { JsonObj } from "~/core/types/Json";
import { PaymentSuccessRes as RazorPayPaymentSuccess } from "~/infra/pg/razorpay/PaymentSuccesssRes";


export type PaymentSuccessReqProps = {
    razorpayPaymentSuccessResponse: RazorPayPaymentSuccess;
}

export class PaymentSuccessReq {
    razorpayPaymentSuccessResponse: RazorPayPaymentSuccess;

    constructor(props: PaymentSuccessReqProps) {
        this.razorpayPaymentSuccessResponse = props.razorpayPaymentSuccessResponse;
    }

    toJson(): JsonObj {
        return {
            razorpayPaymentSuccessResponse: this.razorpayPaymentSuccessResponse.toJson(),
        };
    }

}