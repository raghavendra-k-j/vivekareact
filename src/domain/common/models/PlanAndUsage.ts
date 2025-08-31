import { JsonObj } from "~/core/types/Json";
import { OrgPlanDetail } from "./OrgPlanDetail";
import { OrgUsageDetail } from "./OrgUsageDetail";

export type PlanAndUsageProps = {
    planDetail: OrgPlanDetail;
    usageDetail: OrgUsageDetail;
};

export class PlanAndUsage {
    readonly planDetail: OrgPlanDetail;
    readonly usageDetail: OrgUsageDetail;

    constructor(props: PlanAndUsageProps) {
        this.planDetail = props.planDetail;
        this.usageDetail = props.usageDetail;
    }

    static fromJson(json: JsonObj): PlanAndUsage {
        return new PlanAndUsage({
            planDetail: OrgPlanDetail.fromJson(json.planDetail),
            usageDetail: OrgUsageDetail.fromJson(json.usageDetail),
        });
    }
}
