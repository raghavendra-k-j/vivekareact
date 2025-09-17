import { createContext, useContext } from "react";
import { CourseLayoutStore } from "./CourseLayoutStore";

export const CourseLayoutContext = createContext<CourseLayoutStore | null>(null);

export function useCourseLayoutStore() {
    const store = useContext(CourseLayoutContext);
    if (!store) {
        throw new Error("useCourseLayoutStore must be used within a CourseLayoutContext.Provider");
    }
    return store;
}