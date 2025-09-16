import { createContext, ReactNode, useContext, useRef } from "react";
import { useLMSStore } from "../../layout/LMSLayoutContext";
import { AllSpacesStore } from "./AllSpacesStore";
import { useDialogManager } from "~/ui/widgets/dialogmanager";

const AllSpacesContext = createContext<AllSpacesStore | null>(null);

export function useAllSpacesStore(): AllSpacesStore {
    const context = useContext(AllSpacesContext);
    if (!context) {
        throw new Error("useAllSpacesStore must be used within AllSpacesProvider");
    }
    return context;
}

export function AllSpacesProvider({ children }: { children: ReactNode }) {
    const layoutStore = useLMSStore();
    const dialogManager = useDialogManager();
    const storeRef = useRef<AllSpacesStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new AllSpacesStore({
            layoutStore: layoutStore,
            dialogManager: dialogManager
        });
    }
    return (
        <AllSpacesContext.Provider value={storeRef.current}>
            {children}
        </AllSpacesContext.Provider>
    );
}