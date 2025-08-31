import React, { useEffect, useRef } from "react";
import { PaymentsPageStore } from "./PaymentsPageStore";
import { PaymentsPageContext } from "./PaymentsPageContext";
import { useBillingLayoutStore } from "../layout/BillingLayoutContext";

export function PaymentsPageProvider({ children }: { children: React.ReactNode }) {
    const parentStore = useBillingLayoutStore();
    const store = useRef<PaymentsPageStore | null>(null);
    if (!store.current) {
        store.current = new PaymentsPageStore({
            parentStore: parentStore
        });
    }

    useEffect(() => {
        store.current?.loadOrders({ page: 1 });
    }, [store.current]);


    return (
        <PaymentsPageContext.Provider value={store.current}>
            {children}
        </PaymentsPageContext.Provider>
    );
}
