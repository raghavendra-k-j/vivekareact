import { createContext, useContext } from "react";
import { AdminFormDetailStore } from "./FormDetailStore";

export const AdminFormDetailContext = createContext<AdminFormDetailStore | null>(null);

export const useAdminFormDetailStore = () => {
    const context = useContext(AdminFormDetailContext);
    if (!context) {
        throw new Error("useAdminFormDetailStore must be used within a AdminFormDetailProvider");
    }
    return context;
}