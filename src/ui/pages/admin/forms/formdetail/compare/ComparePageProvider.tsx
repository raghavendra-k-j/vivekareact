import { useEffect, useRef } from "react";
import { AdminFormCompareStore } from "./ComparePageStore";
import { useAdminFormStore } from "../layout/AdminFormContext";
import { AdminFormCompareContext } from "./ComparePageContext";
import { useDialogManager } from "~/ui/widgets/dialogmanager";

export type AdminFormCompareStoreProviderProps = {
    children: React.ReactNode;
}

export function AdminFormCompareStoreProvider(props: AdminFormCompareStoreProviderProps) {
    const storeRef = useRef<AdminFormCompareStore | null>(null);
    const dialogManager = useDialogManager();
    const parentStore = useAdminFormStore();

    if (!storeRef.current) {
        storeRef.current = new AdminFormCompareStore({
            parentStore: parentStore,
            dialogManager: dialogManager,
        });
    }

    useEffect(() => {
        return () => {
            storeRef.current?.dispose();
        }
    }, []);

    return (
        <AdminFormCompareContext.Provider value={storeRef.current}>
            {props.children}
        </AdminFormCompareContext.Provider>
    );
}
