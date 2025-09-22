import { createContext, useContext } from "react";
import { AdminMyCoursesStore } from "./MyCoursesStore";

export const AdminMyCoursesContext = createContext<AdminMyCoursesStore | null>(null);

export const useAdminMyCoursesStore = () => {
    const store = useContext(AdminMyCoursesContext);
    if (!store) {
        throw new Error("useAdminMyCoursesStore must be used within a AdminMyCoursesContext.Provider");
    }
    return store;
}