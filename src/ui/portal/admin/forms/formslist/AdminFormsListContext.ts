import { createContext, useContext } from "react";
import { AdminFormsListStore } from "./AdminFormsListStore";

export const AdminFormsListContext = createContext<AdminFormsListStore | null>(null);

export function useAdminFormsListStore() {
    const store = useContext(AdminFormsListContext);
    if (!store) {
        throw new Error("useAdminFormsListStore must be used within a AdminFormsListContext.Provider");
    }
    return store;
}