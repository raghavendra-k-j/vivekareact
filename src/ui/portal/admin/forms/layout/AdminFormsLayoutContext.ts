import { createContext, useContext } from "react";
import { AdminFormsLayoutStore } from "./AdminFormsLayoutStore";

export const AdminFormsModuleLayoutContext = createContext<AdminFormsLayoutStore | null>(null);

export const useAdminFormsModuleLayoutStore = () => {
    const store = useContext(AdminFormsModuleLayoutContext);
    if (!store) {
        throw new Error("useAdminFormsModuleLayoutStore must be used within a AdminFormsModuleLayoutContext.Provider");
    }
    return store;
}