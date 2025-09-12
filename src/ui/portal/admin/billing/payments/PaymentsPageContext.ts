import { createContext, useContext } from "react";
import { PaymentsPageStore } from "./PaymentsPageStore";

export const PaymentsPageContext = createContext<PaymentsPageStore | null>(null);

export function usePaymentsPageStore(): PaymentsPageStore {
    const store = useContext(PaymentsPageContext);
    if (!store) {
        throw new Error("PaymentsPageStore is not provided in the context");
    }
    return store;
}
