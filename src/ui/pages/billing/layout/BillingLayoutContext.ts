import { createContext, useContext } from "react";
import { BillingLayoutStore as BillingLayoutStore } from "./BillingLayoutStore";

export const BillingLayoutContext = createContext<BillingLayoutStore | null>(null);

export function useBillingLayoutStore(): BillingLayoutStore {
    const store = useContext(BillingLayoutContext);
    if (!store) {
        throw new Error("BillingLayoutStore is not provided in the context");
    }
    return store;
}