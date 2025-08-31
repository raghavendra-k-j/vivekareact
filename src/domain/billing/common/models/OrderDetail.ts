import { JsonObj } from "~/core/types/Json";
import { OrderStatus } from "./OrderStatus";
import { OrderType } from "./OrderType";
import { PaymentProvider } from "./PaymentProvider";

export type OrderDetailProps = {
    id: number;
    uid: string;
    type: OrderType;
    status: OrderStatus;
    gateway: PaymentProvider;
}

export class OrderDetail {

    id: number;
    uid: string;
    type: OrderType;
    status: OrderStatus;
    gateway: PaymentProvider;

    constructor(props: OrderDetailProps) {
        this.id = props.id;
        this.uid = props.uid;
        this.type = props.type;
        this.status = props.status;
        this.gateway = props.gateway;
    }

    static fromJson(json: JsonObj): OrderDetail {
        const type = OrderType.requiredFromValue(json.type);
        const status = OrderStatus.requiredFromValue(json.status);
        const gateway = PaymentProvider.requiredFromValue(json.gateway);
        return new OrderDetail({
            id: json.id,
            uid: json.uid,
            type: type,
            status: status,
            gateway: gateway,
        });
    }

}