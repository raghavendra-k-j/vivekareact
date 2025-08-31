import { PlanDetail } from "~/domain/billing/pricing/models/PlanDetail";


type PlanDetailVmProps = {
    base: PlanDetail;
}

export class PlanDetailVm {

    base: PlanDetail;

    constructor(props: PlanDetailVmProps) {
        this.base = props.base;
    }

    static fromModel(plan: PlanDetail): PlanDetailVm {
        return new PlanDetailVm({
            base: plan
        });
    }

}