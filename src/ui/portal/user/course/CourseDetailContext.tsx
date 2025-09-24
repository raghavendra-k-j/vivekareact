import { createContext, useContext } from "react";
import { CourseDetailStore } from "./CourseDetailStore";

export const CourseDetailContext = createContext<CourseDetailStore | null>(null);

export const useCourseDetailStore = (): CourseDetailStore => {
    const context = useContext(CourseDetailContext);
    if (!context) {
        throw new Error("useCourseDetailStore must be used within a CourseDetailProvider");
    }
    return context;
};

export const useCourseContentsStore = () => {
    const context = useCourseDetailStore();
    return context.contentsStore;
}

export const useCourseReportsStore = () => {
    const context = useCourseDetailStore();
    return context.reportsStore;
}