import { JsonObj } from "~/core/types/Json";
import { ProductType } from "./ProductType";

export type CheckoutOrderItemReqProps = {
    productType: ProductType;
    priceId: number;
    quantity: number;
};


export class CheckoutOrderItemReq {

    productType: ProductType;
    priceId: number;
    quantity: number;

    constructor(props: CheckoutOrderItemReqProps) {
        this.productType = props.productType;
        this.priceId = props.priceId;
        this.quantity = props.quantity;
    }

    toJson(): JsonObj {
        return {
            productType: this.productType.value,
            priceId: this.priceId,
            quantity: this.quantity,
        };
    }

    static fromJson(json: JsonObj): CheckoutOrderItemReq {
        return new CheckoutOrderItemReq({
            productType: ProductType.fromValue(json.productType),
            priceId: json.priceId,
            quantity: json.quantity,
        });
    }


}