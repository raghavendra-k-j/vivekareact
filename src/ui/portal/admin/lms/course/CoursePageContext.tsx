import { createContext, useContext } from "react";
import { CoursePageStore } from "./CoursePageStore";

export const CoursePageContext = createContext<CoursePageStore | null>(null);

export function useCoursePageStore() {
    const store = useContext(CoursePageContext);
    if (!store) {
        throw new Error("useCoursePageStore must be used within a CoursePageContext.Provider");
    }
    return store;
}