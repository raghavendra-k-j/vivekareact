import { ReactNode, useEffect, useRef } from "react";
import { ReportsContext } from "./ReportsContext";
import { ReportsStore } from "./ReportsStore";
import { useCourseLayoutStore } from "../layout/CourseLayoutContext";
import { OverviewCards } from "./components/OverviewCards";
import { LeaderboardView } from "./components/LeaderboardView";
import { GradeDistributionView } from "./components/GradeDistributionView";

function ReportsProvider({ children }: { children: ReactNode }) {
    const store = useRef<ReportsStore | null>(null);
    const layoutStore = useCourseLayoutStore();
    if (store.current === null) {
        store.current = new ReportsStore({
            layoutStore: layoutStore
        });
    }
    return <ReportsContext.Provider value={store.current}>{children}</ReportsContext.Provider>;
}

export default function ReportsPage() {
    return (
        <ReportsProvider>
            <PageInner />
        </ReportsProvider>
    );
}

function PageInner() {
    const layoutStore = useCourseLayoutStore();

    useEffect(() => {
        // Ensure course details are loaded
        if (!layoutStore.courseDetailState.isData && !layoutStore.courseDetailState.isLoading) {
            layoutStore.loadCourseDetails();
        }
    }, [layoutStore]);

    return (
        <div className="h-full overflow-y-auto">
            <div className="container mx-auto p-4 sm:p-6 space-y-6">
                <OverviewCards />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LeaderboardView />
                    <GradeDistributionView />
                </div>
            </div>
        </div>
    );
}