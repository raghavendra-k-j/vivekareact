import {
    CircleDollarSign,
    Users
} from "lucide-react";
import { useMyPlanPageStore } from "./MyPlanPageContext";
import { MyPlanPageProvider } from "./MyPlanPageProvider";
import { PlanOverviewCard } from "./comp/PlanOverviewCard";
import { UsageCard, UsageCardIcon, UsageTopupButton } from "./comp/UsageCard";

export default function MyPlanPage() {
    return (
        <div className="h-full overflow-y-auto">
            <MyPlanPageProvider>
                <MyPlanPageInner />
            </MyPlanPageProvider>
        </div>
    );
}

function MyPlanPageInner() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <PlanOverviewCard />
            <PlanUsageBreakdownGrid />
        </div>
    );
}



function PlanUsageBreakdownGrid() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Usage Summary</h2>
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
                <UsersUsageDetail />
                <CreditUsage />
            </div>
        </div>
    );
}

function UsersUsageDetail() {
    const { plan, usage } = useMyPlanPageStore();
    return (
        <UsageCard
            title="User Seats"
            description={
                <span>
                    <span className="font-semibold text-primary">{usage.totalUsers}</span>
                    {plan.usersLimit && <> of {plan.usersLimit} seats used</>}
                </span>
            }
            icon={
                <UsageCardIcon
                    icon={Users}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-500"
                />
            }
        />
    );
}

function CreditUsage() {
    const { plan } = useMyPlanPageStore();
    return (
        <UsageCard
            title="Available Credits"
            description={
                <span>
                    <span className="font-semibold text-primary">
                        {plan.creditsRemaining.toLocaleString()}
                    </span>{" "}
                    credits left
                </span>
            }
            icon={
                <UsageCardIcon
                    icon={CircleDollarSign}
                    bgColor="bg-indigo-50"
                    iconColor="text-indigo-500"
                />
            }
            headerButton={<UsageTopupButton />}
        />
    );
}
