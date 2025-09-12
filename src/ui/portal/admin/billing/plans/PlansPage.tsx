import { Observer } from "mobx-react-lite";
import { PricedPlan } from "~/domain/billing/pricing/models/PricedPlan";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { PlansPageContext, usePlansPageStore } from "./PlansPageContext";
import { IntervalSelector } from "./comp/IntervalSwitch";
import { PlanCard } from "./comp/PricingCard";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { PlansPageStore } from "./PlansPageStore";
import { useBillingLayoutStore } from "../layout/BillingLayoutContext";


export type PlansPageProviderProps = {
    children: React.ReactNode;
}


export function PlansPageProvider(props: PlansPageProviderProps) {
    const navigate = useNavigate();
    const billingStore = useBillingLayoutStore();
    const storeRef = useRef<PlansPageStore | null>(null);
    if(storeRef.current === null) {
        storeRef.current = new PlansPageStore({
            billingStore: billingStore,
            navigate: navigate
        });
    }

    const store = storeRef.current;

    useEffect(() => {
        store.loadPlans();
    }, []);

    return (
        <PlansPageContext.Provider value={storeRef.current}>
            {props.children}
        </PlansPageContext.Provider>
    );
}

export default function PlansPage() {
    return (
        <PlansPageProvider>
            <Main />
        </PlansPageProvider>
    );
}

function Main() {
    const store = usePlansPageStore();
    return (
        <div className="h-full overflow-y-hidden">
            <div className="max-w-7xl mx-auto h-full overflow-y-auto">
                <Observer>
                    {() =>
                        store.vmState.stateWhen({
                            initOrLoading: () => <CenteredView><LoaderView /></CenteredView>,
                            error: (appError) => <CenteredView><SimpleRetryableAppView appError={appError} onRetry={() => store.loadPlans()} /></CenteredView>,
                            loaded: () => <LoadedContent />,
                        })
                    }
                </Observer>
            </div>
        </div>
    );
}

function CenteredView({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
    );
}



function LoadedContent() {
    return (
        <div className="p-4 md:p-6">
            <IntervalSelector />
            <PlansGrid />
        </div>
    );
}



function PlansGrid() {
    const store = usePlansPageStore();
    return (
        <Observer>
            {() => {
                const group = store.selectedInterval;
                return (
                    <PlansGridLayout plans={group!.pricedPlans} />
                );
            }}
        </Observer>
    );
}

function PlansGridLayout({ plans }: { plans: PricedPlan[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((pp) => (
                <PlanCard key={pp.plan.id} pricedPlan={pp} />
            ))}
        </div>
    );
}