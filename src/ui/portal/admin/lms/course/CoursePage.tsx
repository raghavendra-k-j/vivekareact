import { useRef } from "react";
import { CoursePageStore } from "./CoursePageStore";
import { LMSLayoutStore } from "../layout/LMSLayoutStore";
import { CoursePageContext } from "./CoursePageContext";
import { Outlet } from "react-router";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<CoursePageStore | null>(null);
    const layoutStoreRef = useRef<LMSLayoutStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new CoursePageStore({
            layoutStore: layoutStoreRef,
        });
    }
    return (
        <CoursePageContext.Provider value={storeRef.current}>
            {children}
        </CoursePageContext.Provider>
    );
}


export default function CoursePage() {
    return (<PageProvider>
        <Outlet />
    </PageProvider>);
}