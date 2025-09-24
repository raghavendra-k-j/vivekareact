import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useUserPortalStore } from "../root/UserPortalContext";
import { CourseDetailContext, useCourseDetailStore } from "./CourseDetailContext";
import { CourseDetailStore } from "./CourseDetailStore";
import { CourseDetailHeader } from "./components/CourseDetailHeader";
import { CourseContentList } from "./components/CourseContentList";
import { CoursePerformanceDashboard } from "./components/CoursePerformanceDashboard";
import { CourseTopicReports } from "./components/CourseTopicReports";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Observer } from "mobx-react-lite";

function PageProvider({ children }: { children: React.ReactNode }) {
    const { permalink } = useParams<{ permalink: string }>();
    const userPortalStore = useUserPortalStore();
    const storeRef = useRef<CourseDetailStore | null>(null);

    if (permalink === undefined || permalink === null || permalink.trim() === "") {
        throw new Error("Permalink is required");
    }

    if (!storeRef.current || storeRef.current.permalink !== permalink) {
        storeRef.current = new CourseDetailStore({
            userPortalStore,
            permalink
        });
    }

    return (
        <CourseDetailContext.Provider value={storeRef.current}>
            {children}
        </CourseDetailContext.Provider>
    );
}

function PageContent() {
    const store = useCourseDetailStore();

    useEffect(() => {
        if (store.loadState.isInit) {
            store.loadCourseDetail();
        }
    }, [store]);

    return (
        <Observer>
            {() => {
                if (store.loadState.isData) {
                    return <CourseDetailView />;
                }
                else if (store.loadState.isError) {
                    const appError = store.loadState.error;
                    return (
                        <FullCenteredView className="p-4 sm:p-6">
                            <SimpleRetryableAppView
                                appError={appError}
                                onRetry={() => store.loadCourseDetail()}
                            />
                        </FullCenteredView>
                    );
                }
                return (
                    <FullCenteredView className="p-4 sm:p-6">
                        <LoaderView />
                    </FullCenteredView>
                );
            }}
        </Observer>
    );
}

function CourseDetailView() {
    return (
        <div className="min-h-screen bg-gray-50">
            <CourseDetailHeader />
            <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8">
                        <CourseContentList />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8 mt-8 lg:mt-0">
                        <CoursePerformanceDashboard />
                        <CourseTopicReports />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CourseDetailPage() {
    return (
        <PageProvider>
            <PageContent />
        </PageProvider>
    );
}