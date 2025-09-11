import { createContext, useContext } from "react";
import { PortalLayoutStore } from "./PortalLayoutStore";

export const PortalLayoutContext = createContext<PortalLayoutStore | null>(null);
export function usePortalLayoutStore() {
    const context = useContext(PortalLayoutContext);
    if (!context) {
        throw new Error("usePortalLayoutStore must be used within a PortalLayoutProvider");
    }
    return context;
}