import { JsonObj } from "~/core/types/Json";
import { CheckoutOrderItemReq } from "./CheckoutOrderItemReq";

export type CreateReqProps = {
    orderItems: CheckoutOrderItemReq[]
    currencyCode: string;
    billingAddressId: number;
}

export class CheckoutReq {

    orderItems: CheckoutOrderItemReq[];
    currencyCode: string;
    billingAddressId: number;

    constructor(props: CreateReqProps) {
        this.orderItems = props.orderItems;
        this.currencyCode = props.currencyCode;
        this.billingAddressId = props.billingAddressId;
    }

    toJson(): JsonObj {
        return {
            orderItems: this.orderItems.map(item => item.toJson()),
            currencyCode: this.currencyCode,
            billingAddressId: this.billingAddressId,
        };
    }

}