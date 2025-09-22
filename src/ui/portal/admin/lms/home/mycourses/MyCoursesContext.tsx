import { createContext, useContext } from "react";
import { AdminMyCoursesStore } from "./MyCoursesStore";

const AdminMyCoursesContext = createContext<AdminMyCoursesStore | null>(null);

export function useAdminMyCoursesStore(): AdminMyCoursesStore {
    const context = useContext(AdminMyCoursesContext);
    if (!context) {
        throw new Error("useAdminMyCoursesStore must be used within AdminMyCoursesProvider");
    }
    return context;
}

export { AdminMyCoursesContext };