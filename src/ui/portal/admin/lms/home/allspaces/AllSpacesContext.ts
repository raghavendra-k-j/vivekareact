import { createContext, useContext } from "react";
import { AllSpacesStore } from "./AllSpacesStore";

export const AllSpacesContext = createContext<AllSpacesStore | null>(null);

export function useAllSpacesStore(): AllSpacesStore {
    const context = useContext(AllSpacesContext);
    if (!context) {
        throw new Error("useAllSpacesStore must be used within AllSpacesProvider");
    }
    return context;
}
