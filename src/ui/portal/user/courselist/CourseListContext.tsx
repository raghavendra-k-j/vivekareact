import { createContext, useContext } from "react";
import { CourseListStore } from "./CourseListStore";

export const CourseListContext = createContext<CourseListStore | null>(null);

export const useCourseListStore = (): CourseListStore => {
    const context = useContext(CourseListContext);
    if (!context) {
        throw new Error("useCourseListStore must be used within a CourseListProvider");
    }
    return context;
};