import { createContext, useContext } from "react";
import { AdminFormCompareStore } from "./ComparePageStore";

export const AdminFormCompareContext = createContext<AdminFormCompareStore | null>(null);

export function useAdminFormCompareStore(): AdminFormCompareStore {
    const store = useContext(AdminFormCompareContext);
    if (!store) {
        throw new Error('useAdminFormCompareStore must be used within a AdminFormCompareStore');
    }
    return store;
}