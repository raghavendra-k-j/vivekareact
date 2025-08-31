import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { JsonObj } from "~/core/types/Json";
import { CheckoutOrderItemReq } from "~/domain/billing/common/models/CheckoutOrderItemReq";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { useBillingLayoutStore } from "../layout/BillingLayoutContext";
import { CheckoutPageContext, useCheckoutPageStore } from "./CheckoutPageContext";
import { CheckoutPageStore } from "./CheckoutPageStore";
import { BillingAddressSection } from "./comp/BillingAddress";
import { CheckoutSummarySection } from "./comp/CheckoutSummary";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { ArrowLeft } from "lucide-react";


export function CheckoutPageProvider(props: { children: React.ReactNode }) {
    const billingStore = useBillingLayoutStore();
    const location = useLocation();

    const orderItemsReq: CheckoutOrderItemReq[] = location.state.orderItems.map((item: JsonObj) => CheckoutOrderItemReq.fromJson(item));

    // Create Store
    const storeRef = useRef<CheckoutPageStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = new CheckoutPageStore({
            billingStore: billingStore,
            orderItemsReq: orderItemsReq
        });
    }
    const store = storeRef.current;

    useEffect(() => {
        store.loadPreCheckoutData();
    }, []);

    return (
        <CheckoutPageContext.Provider value={store}>
            {props.children}
        </CheckoutPageContext.Provider>
    );
}



export default function CheckoutPage() {
    return (
        <CheckoutPageProvider>
            <CheckoutPageInner />
        </CheckoutPageProvider>
    );
}

function CenteredView({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full overflow-y-auto flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full p-6">
                {children}
            </div>
        </div>
    );
}



function CheckoutShimmer() {
    return (
        <LoaderView />
    );
}




function CheckoutPageInner() {
    const store = useCheckoutPageStore();
    return (
        <Observer>
            {() => {
                return store.pcdState.stateWhen({
                    initOrLoading: () => <CenteredView><CheckoutShimmer /></CenteredView>,
                    error: (appError) => <CenteredView><SimpleRetryableAppView appError={appError} onRetry={() => store.loadPreCheckoutData()} /></CenteredView>,
                    loaded: () => <LoadedView />
                });
            }}
        </Observer>
    );
}

function Header() {
    return (
        <div className="relative z-40 flex flex-row gap-4 px-4 py-2 bg-surface border-b border-default shadow-sm">
            <IconButton
                size="sm"
                variant="ghost"
                color="secondary"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => { }}
            />
            <h1 className="text-lg font-bold text-default">Complete Your Purchase</h1>
        </div>
    );
}


function LoadedView() {
    return (
        <div className="overflow-y-auto h-full overflow-y-hidden flex flex-col">
            <Header />
            <div className="overflow-y-auto flex-1">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 px-4 md:px-6 py-4 md:py-6">
                        <BillingAddressSection />
                        <CheckoutSummarySection />
                    </div>
                </div>
            </div>
        </div>
    );
}
