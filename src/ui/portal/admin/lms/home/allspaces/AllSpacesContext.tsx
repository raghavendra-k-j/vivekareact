import { createContext, ReactNode, useContext, useRef } from "react";
import { useNavigate } from "react-router";
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
    const navigate = useNavigate();
    const storeRef = useRef<AllSpacesStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new AllSpacesStore({
            layoutStore: layoutStore,
            dialogManager: dialogManager,
            navigate: navigate
        });
    }
    return (
        <AllSpacesContext.Provider value={storeRef.current}>
            {children}
        </AllSpacesContext.Provider>
    );
}