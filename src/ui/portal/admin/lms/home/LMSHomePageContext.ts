import { createContext, useContext } from "react";
import { LMSHomePageStore } from "./LMSHomePageStore";

export const LMSHomePageContext = createContext<LMSHomePageStore | null>(null);

export function useLMSHomePageStore() {
    const store = useContext(LMSHomePageContext);
    if (!store) {
        throw new Error("useLMSHomePageStore must be used within a LMSHomePageContext.Provider");
    }
    return store;
}