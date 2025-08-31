import { JsonObj } from "~/core/types/Json";
import { OrderStatus } from "./OrderStatus";
import { OrderType } from "./OrderType";

export type OrderLIProps = {
    id: number;
    uid: string;
    type: OrderType;
    status: OrderStatus;
    amount: number;
    currencyCode: string;
}

export class OrderLI {

    id: number;
    uid: string;
    type: OrderType;
    status: OrderStatus;
    amount: number;
    currencyCode: string;

    constructor(props: OrderLIProps) {
        this.id = props.id;
        this.uid = props.uid;
        this.type = props.type;
        this.status = props.status;
        this.amount = props.amount;
        this.currencyCode = props.currencyCode;
    }

    static fromJson(json: JsonObj): OrderLI {
        return new OrderLI({
            id: json.id,
            uid: json.uid,
            type: OrderType.requiredFromValue(json.type),
            status: OrderStatus.requiredFromValue(json.status),
            amount: json.amount,
            currencyCode: json.currencyCode
        });
    }

}