import { JsonObj } from "~/core/types/Json";
import { CheckoutAmount } from "./CheckoutAmount";
import { CheckoutOrderItem } from "./CheckoutOrderItem";

export type CheckoutSummaryProps = {
    checkoutAmount: CheckoutAmount;
    items: CheckoutOrderItem[];
}


export class CheckoutSummary {

    checkoutAmount: CheckoutAmount;
    items: CheckoutOrderItem[];

    constructor(props: CheckoutSummaryProps) {
        this.checkoutAmount = props.checkoutAmount;
        this.items = props.items;
    }

    static fromJson(json: JsonObj): CheckoutSummary {
        return new CheckoutSummary({
            checkoutAmount: CheckoutAmount.fromJson(json.checkoutAmount),
            items: json.items.map((item: JsonObj) => CheckoutOrderItem.fromJson(item)),
        });
    }

}

