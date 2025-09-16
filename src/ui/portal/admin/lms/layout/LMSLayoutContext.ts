import { createContext, useContext } from "react";
import { LMSLayoutStore } from "./LMSLayoutStore";

export const LMSLayoutContext = createContext<LMSLayoutStore | null>(null);

export const useLMSStore = () => {
    const store = useContext(LMSLayoutContext);
    if (!store) {
        throw new Error("useLMSCStore must be used within a LMSLayoutContext.Provider" );
    }
    return store;
}