import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { Link } from "react-router";
import { AppError } from "~/core/error/AppError";
import { AmountFmt } from "~/core/utils/AmountFmt";
import { Button } from "~/ui/widgets/button/Button";
import { useCheckoutPageStore } from "../CheckoutPageContext";
import { CheckoutCard, CheckoutCardHeader } from "./CheckoutCard";


export function CheckoutSummarySection() {
    const store = useCheckoutPageStore();
    return (
        <div className="flex-1 flex flex-col gap-6">
            <CheckoutCard className="flex flex-col gap-6 p-6 md:p-8">
                <CheckoutCardHeader
                    title="Checkout Summary"
                    description="Here's the full amount you'll be paying right now"
                />
                <AmountBreakdown />
            </CheckoutCard>

            <div className="flex justify-end">
                <Button onClick={() => store.onClickPayNow()} shadow="md" className="w-full md:w-auto px-8 py-3">
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}


function AmountBreakdown() {
    const store = useCheckoutPageStore();

    return (
        <div className="space-y-4">
            <CheckoutSummaryLoadingStatus />

            <div className="space-y-3">
                <AmountItem
                    label="Subtotal"
                    value={`${store.pcd.currency.symbol}${AmountFmt.format({
                        amountMinor: store.summary.checkoutAmount.subtotalAmountMinor,
                        minorUnit: store.pcd.currency.minorUnit,
                    })}`}
                />

                <Observer>
                    {() => (
                        <AmountItem
                            label="Tax"
                            value={store.summaryState.isLoading ? "" : `${store.pcd.currency.symbol}${AmountFmt.format({
                                amountMinor: store.summary.checkoutAmount.taxAmountMinor ?? 0,
                                minorUnit: store.pcd.currency.minorUnit,
                            })}`}
                            isLoading={store.summaryState.isLoading}
                        />
                    )}
                </Observer>
            </div>

            <div className="border-t border-gray-200 pt-3">
                <Observer>
                    {() => (
                        <AmountItem
                            label="Total"
                            value={store.summaryState.isLoading ? "" : `${store.pcd.currency.symbol}${AmountFmt.format({
                                amountMinor: store.summary.checkoutAmount.totalAmountMinor ?? store.summary.checkoutAmount.subtotalAmountMinor,
                                minorUnit: store.pcd.currency.minorUnit,
                            })}`}
                            isTotal
                            isLoading={store.summaryState.isLoading}
                        />
                    )}
                </Observer>
            </div>

            <Terms />
        </div>
    );
}


function CheckoutSummaryLoadingStatus() {
    const store = useCheckoutPageStore();
    return (
        <Observer>
            {() => {
                return store.summaryState.when({
                    init: () => null,
                    loading: () => null,
                    error: (error) => <CheckoutSummaryError appError={error} />,
                    loaded: () => null,
                });
            }}
        </Observer>
    );
}

function CheckoutSummaryError({ appError }: { appError: AppError }) {
    const store = useCheckoutPageStore();
    const data = appError.data;
    const hideError = (data?.hideError === true);

    if (!hideError) return null;

    return (
        <div className="flex flex-row items-center bg-red-50 border border-red-200 px-4 py-3 rounded-lg mb-4">
            <div className="flex-1">
                <div className="text-sm text-red-700">{appError.description}</div>
            </div>
            <Button
                onClick={() => { store.getCheckoutSummary() }}
                size="xs"
                variant="soft"
                color="danger"
                className="shrink-0 ml-3">
                Retry
            </Button>
        </div>
    );
}


function AmountItem({
    label,
    value,
    isTotal = false,
    isSubtle = false,
    hint,
    isLoading = false,
}: {
    label: string;
    value: string;
    isTotal?: boolean;
    isSubtle?: boolean;
    hint?: string;
    isLoading?: boolean;
}) {
    return (
        <div className={clsx(
            "flex flex-col gap-1",
            isTotal ? "py-2" : ""
        )}>
            {/* Shimmer styles - contained within the component */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .shimmer-contained {
                        position: relative;
                        overflow: hidden;
                        background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
                        background-size: 200% 100%;
                        animation: shimmer-slide 1.5s infinite ease-in-out;
                    }
                    @keyframes shimmer-slide {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `
            }} />

            <div className="flex items-baseline justify-between">
                <span className={clsx(
                    isTotal ? "text-lg font-semibold text-gray-900" : "text-base text-gray-600"
                )}>
                    {label}
                </span>
                {isLoading ? (
                    <div className={clsx(
                        "shimmer-contained rounded",
                        isTotal ? "h-5 w-24" : "h-4 w-20"
                    )} />
                ) : (
                    <span className={clsx(
                        "tabular-nums font-medium",
                        isTotal
                            ? "text-lg font-bold text-primary"
                            : isSubtle
                                ? "text-gray-600"
                                : "text-gray-900"
                    )}>
                        {value}
                    </span>
                )}
            </div>
            {hint && !isLoading && (
                <div className="flex justify-start">
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                        {hint}
                    </span>
                </div>
            )}
        </div>
    );
}


function Terms() {
    return (
        <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 leading-relaxed">
                By continuing, you agree to our{" "}
                <Link
                    to="payment-terms"
                    className="text-primary hover:text-primary-dark hover:underline font-medium transition-colors">
                    terms
                </Link>{" "}
                and{" "}
                <Link
                    to="refund-policy"
                    className="text-primary hover:text-primary-dark hover:underline font-medium transition-colors">
                    refund policy
                </Link>
                .
            </p>
        </div>
    );
}
