import { createContext, useContext } from "react";
import { CourseContentsStore } from "./CourseContentsStore";

export const CourseContentsContext = createContext<CourseContentsStore | null>(null);

export const useCourseContentsStore = (): CourseContentsStore => {
    const context = useContext(CourseContentsContext);
    if (!context) {
        throw new Error("useCourseContentsStore must be used within a CourseContentsProvider");
    }
    return context;
};