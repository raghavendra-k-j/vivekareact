import { JsonObj } from "~/core/types/Json";
import { OrderDetail } from "./OrderDetail";
import { PGOrderData } from "./PGOrderData";
import { PGOrderDataFactory } from "./PGOrderDataFactory";


export type CreatePlanOrderResProps = {
    order: OrderDetail;
    pgOrderData: PGOrderData;
}

export class CreatePlanOrderRes {
    order: OrderDetail;
    pgOrderData: PGOrderData;

    constructor(props: CreatePlanOrderResProps) {
        this.order = props.order;
        this.pgOrderData = props.pgOrderData;
    }

    static fromJson(json: JsonObj): CreatePlanOrderRes {
        const order = OrderDetail.fromJson(json.order);
        const pgOrderData = PGOrderDataFactory.createFromJson({
            gateway: order.gateway,
            json: json.gatewayData
        });
        return new CreatePlanOrderRes({
            order: order,
            pgOrderData: pgOrderData!
        });
    }

}