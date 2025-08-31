import { JsonObj } from "~/core/types/Json";
import { PaymentProvider } from "./PaymentProvider";
import { PGOrderData } from "./PGOrderData";
import { RzpOrderData } from "./RzpOrderData";

export abstract class PGOrderDataFactory {

    static createFromJson({ gateway, json }: { gateway: PaymentProvider, json: JsonObj }): PGOrderData | null {
        const gatewayValue = json[gateway.value];
        switch (gateway.value) {
            case PaymentProvider.RAZORPAY.value:
                return RzpOrderData.fromJson(gatewayValue);
            default:
                return null;
        }
    }

}