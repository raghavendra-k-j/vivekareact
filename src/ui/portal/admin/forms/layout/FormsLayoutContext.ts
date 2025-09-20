import { createContext, useContext } from "react";
import { AdminFormsLayoutStore } from "./FormsLayoutStore";

export const AdminFormsLayoutContext = createContext<AdminFormsLayoutStore | null>(null);

export const useAdminFormsModuleStore = () => {
    const store = useContext(AdminFormsLayoutContext);
    if (!store) {
        throw new Error("useAdminFormsLayout must be used within a AdminFormsLayoutContext.Provider" );
    }
    return store;
}