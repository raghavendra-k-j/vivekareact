import React, { useRef } from "react";
import { MyPlanPageContext } from "./MyPlanPageContext";
import { MyPlanPageStore } from "./MyPlanPageStore";
import { useBillingLayoutStore } from "../layout/BillingLayoutContext";


export function MyPlanPageProvider({ children }: { children: React.ReactNode }) {
    const parentStore = useBillingLayoutStore();
    const store = useRef<MyPlanPageStore | null>(null);
    if (!store.current) {
        store.current = new MyPlanPageStore({
            parentStore: parentStore,
        });
    }
    return (
        <MyPlanPageContext.Provider value={store.current}>
            {children}
        </MyPlanPageContext.Provider>
    );
};