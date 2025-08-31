import { JsonObj } from "~/core/types/Json";
import { OrderDetail } from "./OrderDetail";


export type PaymentSuccessResProps = {
    order: OrderDetail;
}

export class PaymentSuccessRes {
    order: OrderDetail;

    constructor(props: PaymentSuccessResProps) {
        this.order = props.order;
    }

    static fromJson(json: JsonObj): PaymentSuccessRes {
        const order = OrderDetail.fromJson(json.order);
        return new PaymentSuccessRes({
            order: order,
        });
    }

}