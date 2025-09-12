import { Badge } from "~/ui/widgets/badges/Badge";
import { useMyPlanPageStore } from "../MyPlanPageContext";
import { DateFmt } from "~/core/utils/DateFmt";
import { Link } from "react-router";
import { Button } from "~/ui/widgets/button/Button";

export function PlanOverviewCard() {
    const { plan } = useMyPlanPageStore();
    const isExpired = !plan.isActive;

    return (
        <div className="bg-surface border border-default rounded-sm shadow-sm p-4 flex justify-between items-start">
            <div>
                <Badge variant="solid" color={isExpired ? "red" : "primary"}>
                    {isExpired ? "Expired" : "Active"}
                </Badge>

                <div className="text-lg text-primary font-bold mt-1">{plan.name}</div>

                <PlanStatusMessage />
            </div>

            <Link to="/billing/plans">
                <Button size="sm">
                    {plan.isTrial ? "Upgrade Plan" : "Manage Plan"}
                </Button>
            </Link>
        </div>
    );
}

function PlanStatusMessage() {
    const { plan } = useMyPlanPageStore();
    const isExpired = !plan.isActive;

    const endsAtFormatted = DateFmt.datetime(plan.endsAt!);

    if (isExpired) {
        return (
            <div className="text-sm text-red-600">
                {plan.isTrial
                    ? `Your free trial expired on ${endsAtFormatted}.`
                    : `Your plan expired on ${endsAtFormatted}.`}
            </div>
        );
    }

    if (plan.isTrial) {
        return (
            <div className="text-sm text-secondary">
                {`Free trial ends on ${endsAtFormatted}.`}
            </div>
        );
    }

    return (
        <div className="text-sm text-secondary">
            {`Current plan ends on ${endsAtFormatted}.`}
        </div>
    );
}
