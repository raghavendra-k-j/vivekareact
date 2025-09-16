import { ReactNode, useRef } from "react";
import Card, { CardBody } from "~/ui/components/card";
import { SettingsContext } from "./SettingsContext";
import { SettingsStore } from "./SettingsStore";
import { useCoursePageStore } from "../CoursePageContext";

function SettingsProvider({ children }: { children: ReactNode }) {
    const store = useRef<SettingsStore | null>(null);
    const layoutStore = useCoursePageStore();
    if (store.current === null) {
        store.current = new SettingsStore({
            layoutStore: layoutStore
        });
    }
    return <SettingsContext.Provider value={store.current}>{children}</SettingsContext.Provider>;
}

export default function SettingsPage() {
    return (
        <SettingsProvider>
            <PageInner />
        </SettingsProvider>
    );
}

function PageInner() {
    return (
        <div className="h-full overflow-y-auto">
            <div className="container mx-auto p-4 sm:p-6 grid grid-cols-1 gap-6">
                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Course Settings</h2>
                        <p className="text-secondary">Settings coming soon...</p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}