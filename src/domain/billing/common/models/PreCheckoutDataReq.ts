import { JsonObj } from "~/core/types/Json";
import { CheckoutOrderItemReq } from "./CheckoutOrderItemReq";

export type PreCheckoutDataReqProps = {
    items: CheckoutOrderItemReq[];
}

export class PreCheckoutDataReq {

    items: CheckoutOrderItemReq[];

    constructor(props: PreCheckoutDataReqProps) {
        this.items = props.items;
    }

    toJson(): JsonObj {
        return {
            orderItems: this.items.map(item => item.toJson()),
        };
    }

}