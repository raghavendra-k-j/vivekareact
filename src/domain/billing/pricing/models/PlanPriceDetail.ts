import { JsonObj } from "~/core/types/Json";

export type PlanPriceDetailProps = {
    id: number;
    planId: number;
    priceTargetId: string;
    currencyCode: string;
    amountMinor: number;
}


export class PlanPriceDetail {

    readonly id: number;
    readonly planId: number;
    readonly priceTargetId: string;
    readonly currencyCode: string;
    readonly amountMinor: number;

    constructor(props: PlanPriceDetailProps) {
        this.id = props.id;
        this.planId = props.planId;
        this.priceTargetId = props.priceTargetId;
        this.currencyCode = props.currencyCode;
        this.amountMinor = props.amountMinor;
    }

    static fromJson(json: JsonObj): PlanPriceDetail {
        return new PlanPriceDetail({
            id: json.id,
            planId: json.planId,
            priceTargetId: json.priceTargetId,
            currencyCode: json.currencyCode,
            amountMinor: json.amountMinor,
        });
    }


}