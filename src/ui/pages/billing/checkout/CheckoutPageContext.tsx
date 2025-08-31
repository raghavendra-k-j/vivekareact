import { createContext, useContext } from "react";
import { CheckoutPageStore } from "./CheckoutPageStore";

export const CheckoutPageContext = createContext<CheckoutPageStore | null>(null);

export function useCheckoutPageStore(): CheckoutPageStore {
    const context = useContext(CheckoutPageContext);
    if (!context) {
        throw new Error("useCheckoutPageStore must be used within a CheckoutPageProvider");
    }
    return context;
}