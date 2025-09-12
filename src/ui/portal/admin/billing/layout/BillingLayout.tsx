import clsx from "clsx";
import { useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router";
import { useEnableDragScroll } from "~/ui/hooks/useEnableDragScroll";
import { BillingLayoutContext, useBillingLayoutStore } from "./BillingLayoutContext";
import { BillingLayoutStore } from "./BillingLayoutStore";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";

export function BillingLayoutProvider({ children, showAppBar }: { children: React.ReactNode, showAppBar: boolean }) {
    const appStore = useAppStore();
    const storeRef = useRef<BillingLayoutStore | null>(null);
    if (!storeRef.current || storeRef.current.showAppBar !== showAppBar) {
        storeRef.current = new BillingLayoutStore({
            appStore: appStore,
            showAppBar: showAppBar
        });
    }
    const store = storeRef.current;
    return (
        <BillingLayoutContext.Provider value={store}>
            {children}
        </BillingLayoutContext.Provider>
    );
}

export type BillingLayoutProps = {
    showAppbar: boolean;
};

export default function BillingLayout(props: BillingLayoutProps) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            console.log("Razorpay script loaded");
        };
        document.body.appendChild(script);
    }, []);

    return (
        <BillingLayoutProvider showAppBar={props.showAppbar}>
            <BillingInner />
        </BillingLayoutProvider>
    );
}

function BillingInner() {
    return (
        <div className="h-full overflow-y-hidden flex flex-col">
            <BillingHeader />
            <Outlet />
        </div>
    );
}

function BillingHeader() {
    const store = useBillingLayoutStore();
    return (
        <div className="bg-surface shadow-sm">
            {/* <BillingAppBar /> */}
            {store.showAppBar && <BillingTabBar />}
        </div>
    );
}

// function BillingAppBar() {
//     return (
//         <div className="px-4 sm:px-6 py-4 border-b border-secondary">
//             <h1 className="text-xl font-bold text-default">Billing</h1>
//             <p className="text-sm text-secondary">Manage your usage, plans, and payments</p>
//         </div>
//     );
// }

function BillingTabBar() {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEnableDragScroll(scrollRef);

    return (
        <nav
            ref={scrollRef}
            className="px-4 sm:px-6 flex gap-4 border-b border-default overflow-x-auto scrollbar-hide"
        >
            <BillingTabLink to="/billing/my-plan" label="My Plan" />
            <BillingTabLink to="/billing/plans" label="Plans" />
            <BillingTabLink to="/billing/topup" label="Top Up" />
            <BillingTabLink to="/billing/payments" label="Payment History" />
        </nav>
    );
}

type BillingTabLinkProps = {
    to: string;
    label: string;
};

function BillingTabLink({ to, label }: BillingTabLinkProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    "px-2 py-2 text-sm font-bold whitespace-nowrap transition border-b-3",
                    isActive
                        ? "text-primary border-primary"
                        : "text-secondary border-transparent hover:text-default"
                )
            }
        >
            {label}
        </NavLink>
    );
}
