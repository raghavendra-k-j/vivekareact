import { createContext, useContext } from "react";
import { SidebarStore } from "./SidebarStore";

export const SidebarContext = createContext<SidebarStore | null>(null);

export const useSidebarStore = (): SidebarStore => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebarStore must be used within a SidebarProvider");
    }
    return context;
}
