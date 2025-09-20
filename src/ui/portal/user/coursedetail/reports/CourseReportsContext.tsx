import { createContext, useContext } from "react";
import { CourseReportsStore } from "./CourseReportsStore";

export const CourseReportsContext = createContext<CourseReportsStore | null>(null);

export const useCourseReportsStore = (): CourseReportsStore => {
    const context = useContext(CourseReportsContext);
    if (!context) {
        throw new Error("useCourseReportsStore must be used within a CourseReportsProvider");
    }
    return context;
};