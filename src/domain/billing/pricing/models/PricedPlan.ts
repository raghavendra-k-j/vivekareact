import { JsonObj } from "~/core/types/Json";
import { PlanDetail } from "./PlanDetail";
import { PlanPriceDetail } from "./PlanPriceDetail";


export type PricedPlanProps = {
    plan: PlanDetail;
    price: PlanPriceDetail;
}


export class PricedPlan {

    plan: PlanDetail;
    price: PlanPriceDetail;

    constructor(props: PricedPlanProps) {
        this.plan = props.plan;
        this.price = props.price;
    }

    static fromJson(json: JsonObj): PricedPlan {
        return new PricedPlan({
            plan: PlanDetail.fromJson(json.plan),
            price: PlanPriceDetail.fromJson(json.price),
        });
    }

}