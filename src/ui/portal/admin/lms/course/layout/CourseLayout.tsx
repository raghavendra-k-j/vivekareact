import { Observer } from "mobx-react-lite";
import { ReactNode, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { useIsLinkActive } from "~/ui/hooks/useIsLinkActive";
import { TabItem } from "~/ui/widgets/tabs/TabItem";
import { TabsList } from "~/ui/widgets/tabs/TabList";
import { AdminPageAppBar, AdminPageAppBarTitle } from "~/ui/portal/admin/components/PageAppBar";
import { useLMSStore } from "../../layout/LMSLayoutContext";
import { CoursePageContext, useCoursePageStore } from "../CoursePageContext";
import { CoursePageStore } from "../CoursePageStore";

function CourseProvider({ children }: { children: ReactNode }) {
    const store = useRef<CoursePageStore | null>(null);
    const layoutStore = useLMSStore();
    if (store.current === null) {
        store.current = new CoursePageStore({
            layoutStore: layoutStore,
        });
    }
    return <CoursePageContext.Provider value={store.current}>
        {children}
    </CoursePageContext.Provider>;
}

export default function CourseLayout() {
    return (<CourseProvider>
        <PageInner />
    </CourseProvider>
    );
}

function PageInner() {
    const store = useCoursePageStore();
    useEffect(() => {
        // TODO: load course data if needed
    }, [store]);

    return (<div className="w-full h-full overflow-y-hidden flex flex-col">
        <AdminPageAppBar start={<AdminPageAppBarTitle title="Course Management" />} bottom={<Tabs />} />
        <Observer>
            {() => {
                // Assuming always loaded for now
                return <Outlet />;
            }}
        </Observer>
    </div>);
}

function Tabs() {
    const navigate = useNavigate();
    const tabs = [
        { to: "content", label: "Content" },
        { to: "members", label: "Members" },
        { to: "reports", label: "Reports" },
        { to: "settings", label: "Settings" },
    ];
    return (
        <TabsList >
            {tabs.map(t => {
                const isTabActive = useIsLinkActive(t.to, true);
                return (
                    <TabItem
                        key={t.to}
                        isActive={isTabActive}
                        onClick={() => navigate(t.to)}
                    >
                        {t.label}
                    </TabItem>
                );
            })}
        </TabsList>
    );
}