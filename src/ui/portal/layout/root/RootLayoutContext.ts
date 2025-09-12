import { createContext, useContext } from "react";
import { RootLayoutStore } from "../root/RootLayoutStore";

export const RootLayoutContext = createContext<RootLayoutStore | null>(null);

export const useRootLayoutStore = () => {
    const store = useContext(RootLayoutContext);
    if (!store) {
        throw new Error("useRootLayoutStore must be used within a RootLayoutProvider");
    }
    return store;
}