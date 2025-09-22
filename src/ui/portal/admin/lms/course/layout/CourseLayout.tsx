import { Copy, Check } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { CourseStatusBadge } from "~/ui/components/form/commons/CourseStatusBadge";
import { useIsLinkActive } from "~/ui/hooks/useIsLinkActive";
import { Button, ButtonGroup } from "~/ui/widgets/button/Button";
import { useDialogManager } from "~/ui/widgets/dialogmanager";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { TabItem } from "~/ui/widgets/tabs/TabItem";
import { TabsList } from "~/ui/widgets/tabs/TabList";
import { useLMSStore } from "../../layout/LMSLayoutContext";
import { CourseLayoutContext, useCourseLayoutStore } from "./CourseLayoutContext";
import { CourseLayoutStore } from "./CourseLayoutStore";
import { copyToClipboard } from "~/core/utils/clipboard";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<CourseLayoutStore | null>(null);
    const layoutStore = useLMSStore();
    const { permalink } = useParams<{ permalink: string }>();
    const dialogManager = useDialogManager();

    if (!storeRef.current) {
        if (!permalink) {
            throw new Error("Course permalink is required");
        }
        const formService = new AdminFormsService();
        storeRef.current = new CourseLayoutStore({
            layoutStore: layoutStore,
            permalink: permalink,
            dialogManager: dialogManager,
            formsService: formService
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
        { to: "topics", label: "Topics" },
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




function CourseCodeButton() {
    const store = useCourseLayoutStore();
    const [showCode, setShowCode] = useState(false);

    const handleCopy = () => {
        copyToClipboard({ text: store.course.courseCode });
        setShowCode(true);
        const timer = setTimeout(() => setShowCode(false), 500);
        return () => clearTimeout(timer);
    };

    return (
        <ButtonGroup attached={true}>
            <Button
                variant="outline"
                color="secondary"
                size="sm"
                className="font-bold px-3"
            >
                <span className="font-bold">{store.course.courseCode}</span>
            </Button>
            <Button
                onClick={handleCopy}
                variant={showCode ? "solid" : "outline"}
                color={showCode ? "primary" : "secondary"}
                size="sm"
            >
                {showCode ? (
                    <>
                        <Check className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                    </>
                )}
            </Button>
        </ButtonGroup>
    );
}


function AppBarView() {
    const store = useCourseLayoutStore();

    return (
        <div className="px-6 py-3 border-b border-default">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="text-lg font-semibold text-default truncate max-w-xs">
                        {store.course.displayName}
                    </h1>
                </div>
                <div className="flex items-center">
                    <CourseCodeButton />
                </div>
            </div>
        </div>
    );
}


function CourseInfoView() {
    const store = useCourseLayoutStore();
    const lmsStore = useLMSStore();

    const createdDateTime = DateFmt.datetime(store.course.createdAt);
    const updatedDateTime = DateFmt.datetime(store.course.updatedAt);
    const creatorName = store.course.creator.name;
    const lastModifierName = store.course.lastModifier.name;

    const tooltipText = `Created: ${createdDateTime} by ${creatorName}\nLast Updated: ${updatedDateTime} by ${lastModifierName}`;

    const infoItems = [
        `Created on: ${DateFmt.date(store.course.createdAt)}`,
        `${store.course.totalAdmins} ${lmsStore.adminLabelPlural}`,
        `${store.course.totalUsers} ${lmsStore.userLabelPlural}`,
        `${store.course.totalAssessments} Assessments`,
        `${store.course.totalSurveys} Surveys`
    ];

    return (
        <div className="px-6 py-1.5 bg-surface-secondary/50 border-b border-default">
            <div className="flex items-center divide-x divide-default gap-0">
                <div className="pr-3">
                    <CourseStatusBadge status={store.course.courseStatus} />
                </div>
                {infoItems.map((item, index) => (
                    <div key={index} className="px-3">
                        {index === 0 ? (
                            <span
                                className="text-sm text-secondary cursor-pointer"
                                title={tooltipText}
                            >
                                {item}
                            </span>
                        ) : (
                            <span className="text-sm text-secondary">{item}</span>
                        )}
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