import { createContext, useContext } from "react";
import { PlansPageStore } from "./PlansPageStore";

export const PlansPageContext = createContext<PlansPageStore | null>(null);

export function usePlansPageStore() : PlansPageStore {
    const context = useContext(PlansPageContext);
    if (!context) {
        throw new Error("usePlansPageStore must be used within a PlansPageProvider");
    }
    return context;
}