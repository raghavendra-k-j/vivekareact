import { Check, Info, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { AmountFmt } from "~/core/utils/AmountFmt";
import { PricedPlan } from "~/domain/billing/pricing/models/PricedPlan";
import { Button } from "~/ui/widgets/button/Button";
import { usePlansPageStore } from "../PlansPageContext";

interface PlanCardProps {
    pricedPlan: PricedPlan;
}

export function PlanCard({ pricedPlan }: PlanCardProps) {
    const store = usePlansPageStore();
    return (
        <div className="relative bg-surface rounded-lg border border-default p-5 shadow-md">
            <PlanHeader pricedPlan={pricedPlan} />
            <PlanPricing pricedPlan={pricedPlan} />
            <PlanFeatures pricedPlan={pricedPlan} />
            <Button
                onClick={() => store.purchasePlan(pricedPlan)}
                className="w-full"
            >
                Purchase
            </Button>
        </div>
    );
}


function PlanHeader({ pricedPlan }: { pricedPlan: PricedPlan }) {
    return (
        <div className="mb-4">
            <h3 className="text-xl font-bold text-default">
                {pricedPlan.plan.name}
            </h3>
            <p className="text-secondary text-base-m mt-1">
                {pricedPlan.plan.description}
            </p>
        </div>
    );
}

function PlanPricing({ pricedPlan }: { pricedPlan: PricedPlan }) {
    const store = usePlansPageStore();
    const major = AmountFmt.format({
        amountMinor: pricedPlan.price.amountMinor,
        minorUnit: store.currency.minorUnit,
    });
    const interval = pricedPlan.plan.billingInterval.value;

    return (
        <div className="mb-4">
            <span className="text-primary font-bold text-3xl">
                {store.currency.symbol}
                {major}
            </span>
            <span className="text-secondary text-base mt-1"> / {interval}</span>
        </div>
    );
}

function PlanFeatures({ pricedPlan }: { pricedPlan: PricedPlan }) {
    const { plan } = pricedPlan;

    return (
        <div className="space-y-2 mb-5 text-sm">

            <FeatureItem
                text="Core features included"
            />


            <FeatureItem
                text={`Up to ${plan.usersLimit} user`}
                tooltip={{
                    title: "User Account Limit",
                    content: "The maximum number of user accounts allowed in your organization."
                }}
            />

            <div className="mt-4">
                <FeatureTitle title="Assessments and Surveys" />
                <div className="space-y-2">
                    <FeatureItem
                        text={`${plan.formsAiGenUnits} AI Creations`}
                    />
                    <FeatureItem
                        text={`${plan.formsAiTransUnits} AI Translations`}
                    />
                </div>
            </div>

        </div>
    );
}

interface TooltipOptions {
    title: string | ReactNode;
    content: string | ReactNode;
}

interface FeatureItemProps {
    text: string;
    tooltip?: TooltipOptions;
    enabled?: boolean;
}

function FeatureItem({ text, tooltip, enabled = true }: FeatureItemProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const StartIcon = enabled ? Check : X;

    const renderTooltipContent = () => {
        if (!tooltip) return null;

        return (
            <div className="text-sm">
                {tooltip.title && (
                    <div className="font-semibold mb-1">{tooltip.title}</div>
                )}
                <div>{tooltip.content}</div>
            </div>
        );
    };

    return (
        <div className="flex items-center gap-2 text-secondary">
            <StartIcon className={`w-4 h-4 ${enabled ? "text-success" : "text-error"} shrink-0`} />
            <span className={enabled ? "text-secondary" : "text-tertiary line-through"}>
                {text}
            </span>
            {tooltip && (
                <div className="relative">
                    <Info
                        className="w-3.5 h-3.5 text-tertiary hover:text-secondary cursor-pointer transition-colors"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => setShowTooltip(!showTooltip)}
                    />
                    {showTooltip && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 p-2.5 text-xs text-default bg-surface border border-default rounded shadow-sm z-10">
                            {renderTooltipContent()}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}



type FeatureTitleProps = {
    title: string;
}

function FeatureTitle({ title }: FeatureTitleProps) {
    return (
        <h4 className="text-sm font-semibold text-default mb-2">
            {title}
        </h4>
    );
}
