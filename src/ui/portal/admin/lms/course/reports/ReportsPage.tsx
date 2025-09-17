import { ReactNode, useRef } from "react";
import Card, { CardBody } from "~/ui/components/card";
import { ReportsContext } from "./ReportsContext";
import { ReportsStore } from "./ReportsStore";
import { useCourseLayoutStore } from "../layout/CourseLayoutContext";

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
    return (
        <div className="h-full overflow-y-auto">
            <div className="container mx-auto p-4 sm:p-6 grid grid-cols-1 gap-6">
                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Course Reports</h2>
                        <p className="text-secondary">Reports coming soon...</p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}