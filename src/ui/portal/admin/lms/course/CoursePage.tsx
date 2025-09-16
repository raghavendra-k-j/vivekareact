import { useRef } from "react";
import { Outlet } from "react-router";
import { useLMSStore } from "../layout/LMSLayoutContext";
import { CoursePageContext } from "./CoursePageContext";
import { CoursePageStore } from "./CoursePageStore";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<CoursePageStore | null>(null);
    const layoutStore = useLMSStore();
    if (!storeRef.current) {
        storeRef.current = new CoursePageStore({
            layoutStore: layoutStore,
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