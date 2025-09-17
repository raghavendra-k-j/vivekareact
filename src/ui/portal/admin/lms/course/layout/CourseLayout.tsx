import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { useIsLinkActive } from "~/ui/hooks/useIsLinkActive";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { TabItem } from "~/ui/widgets/tabs/TabItem";
import { TabsList } from "~/ui/widgets/tabs/TabList";
import { useLMSStore } from "../../layout/LMSLayoutContext";
import { CourseLayoutContext, useCourseLayoutStore } from "./CourseLayoutContext";
import { CourseLayoutStore } from "./CourseLayoutStore";
import { Badge } from "~/ui/widgets/badges/Badge";
import { DateFmt } from "~/core/utils/DateFmt";
import { Button } from "~/ui/widgets/button/Button";
import { Copy } from "lucide-react";
import { LMSConst } from "~/domain/lms/models/LMSConst";
import { useDialogManager } from "~/ui/widgets/dialogmanager";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<CourseLayoutStore | null>(null);
    const layoutStore = useLMSStore();
    const { courseId: courseIdParam } = useParams<{ courseId: string }>();
    const dialogManager = useDialogManager();

    if (!storeRef.current) {
        if (!courseIdParam) {
            throw new Error("Course ID is required");
        }
        const courseId = parseInt(courseIdParam, 10);
        if (isNaN(courseId)) {
            throw new Error("Invalid course ID");
        }
        storeRef.current = new CourseLayoutStore({
            layoutStore: layoutStore,
            courseId: courseId,
            dialogManager: dialogManager
        });
    }
    return (
        <CourseLayoutContext.Provider value={storeRef.current}>
            {children}
        </CourseLayoutContext.Provider>
    );
}

function CourseTabs() {
    const navigate = useNavigate();
    const tabs = [
        { to: "content", label: "Content" },
        { to: "members", label: "Members" },
        { to: "reports", label: "Reports" },
        { to: "settings", label: "Settings" },
    ];
    return (
        <TabsList className="px-6">
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




function AppBarView() {
    const store = useCourseLayoutStore();
    return (
        <div className="px-6 py-3 border-b border-default">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="text-lg font-semibold text-default truncate max-w-xs">
                        {store.course.name}
                    </h1>
                </div>
                <div className="flex items-center">
                    <Button
                        variant="outline"
                        color="secondary"
                        size="sm"
                        onClick={() => store.copyCouseCode()}
                        className="flex items-center gap-1"
                    >
                        <Copy className="w-4 h-4" />
                        Copy Course Code
                    </Button>
                </div>
            </div>
        </div>
    );
}


function CourseInfoView() {
    const store = useCourseLayoutStore();

    const infoItems = [
        `Created on: ${DateFmt.date(store.course.createdAt)}`,
        `${store.course.totalAdmins} ${store.entity(LMSConst.ENTITY_ADMIN).namePlural}`,
        `${store.course.totalUsers} ${store.entity(LMSConst.ENTITY_USER).namePlural}`,
        `${store.course.totalAssessments} Assessments`,
        `${store.course.totalSurveys} Surveys`
    ];

    return (
        <div className="px-6 py-1.5 bg-surface-secondary/50 border-b border-default">
            <div className="flex items-center divide-x divide-default gap-0">
                <div className="pr-3">
                    <Badge
                        color={store.course.status.isActive ? "success" : "secondary"}
                        size="sm"
                    >
                        {store.course.status.label}
                    </Badge>
                </div>
                {infoItems.map((item, index) => (
                    <div key={index} className="px-3">
                        <span className="text-sm text-secondary">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


function HeaderView() {
    return (<div className="bg-surface border-b border-default shadow-sm">
        <AppBarView />
        <CourseInfoView />
        <CourseTabs />
    </div>);
}



function CourseLayoutInner() {
    const store = useCourseLayoutStore();

    useEffect(() => {
        if (store.courseDetailState.isInit) {
            store.loadCourseDetails();
        }
    }, [store]);

    return (
        <Observer>
            {() => {
                return store.courseDetailState.stateWhen({
                    initOrLoading: () => (
                        <FullCenteredView className="p-6">
                            <LoaderView />
                        </FullCenteredView>
                    ),
                    loaded: () => (<>
                        <HeaderView />
                        <Outlet />
                    </>),
                    error: (error) => (
                        <FullCenteredView className="p-6">
                            <SimpleRetryableAppView
                                appError={error}
                                onRetry={() => store.loadCourseDetails()}
                            />
                        </FullCenteredView>
                    ),
                });
            }}
        </Observer>
    );
}


export default function CourseLayout() {
    return (
        <PageProvider>
            <CourseLayoutInner />
        </PageProvider>
    );
}