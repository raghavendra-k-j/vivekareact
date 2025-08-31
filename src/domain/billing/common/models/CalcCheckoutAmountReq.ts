import { JsonObj } from "~/core/types/Json";
import { CheckoutOrderItemReq } from "./CheckoutOrderItemReq";


export type CheckoutSummaryReqProps = {
    billingAddress: JsonObj;
    orderItems: CheckoutOrderItemReq[];
    includeItemDetails: boolean;
}

export class CheckoutSummaryReq {

    billingAddress: JsonObj;
    orderItems: CheckoutOrderItemReq[];
    includeItemDetails: boolean;

    constructor(props: CheckoutSummaryReqProps) {
        this.billingAddress = props.billingAddress;
        this.orderItems = props.orderItems;
        this.includeItemDetails = props.includeItemDetails;
    }

    toJson(): JsonObj {
        return {
            billingAddress: this.billingAddress,
            orderItems: this.orderItems.map(item => item.toJson()),
            includeItemDetails: this.includeItemDetails
        };
    }
}