import { JsonObj } from "~/core/types/Json";
import { PaymentProvider } from "./PaymentProvider";

export type CheckoutResProps = {
    provider: PaymentProvider;
    providerData: JsonObj;
}

export class CheckoutRes {

    provider: PaymentProvider;
    providerData: JsonObj;

    constructor(props: CheckoutResProps) {
        this.provider = props.provider;
        this.providerData = props.providerData;
    }

    static fromJson(json: JsonObj): CheckoutRes {
        const provider = PaymentProvider.requiredFromValue(json.provider);
        const providerData = json.providerData;
        return new CheckoutRes({
            provider: provider,
            providerData: providerData,
        });
    }


}