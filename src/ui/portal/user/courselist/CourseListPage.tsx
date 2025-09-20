import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useHomePageStore } from "../home/HomePageContext";
import { CourseGrid, CourseGridSkeleton } from "./components/CourseGrid";
import { HeaderView } from "./components/HeaderView";
import { CourseListContext, useCourseListStore } from "./CourseListContext";
import { CourseListStore } from "./CourseListStore";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<CourseListStore | null>(null);
    const homePageStore = useHomePageStore();

    if (storeRef.current === null) {
        storeRef.current = new CourseListStore({
            homeStore: homePageStore
        });
    }
    return (
        <CourseListContext.Provider value={storeRef.current}>
            {children}
        </CourseListContext.Provider>
    );
}

function PageInner() {
    const store = useCourseListStore();

    useEffect(() => {
        if (store.loadState.isInit) {
            store.loadCourses();
        }
    }, [store]);

    return (
        <div className="h-full min-h-0 flex flex-col flex-1 overflow-y-auto py-4 sm:py-6">
            <HeaderView />
            <Observer>
                {() => {
                    if (store.loadState.isData) {
                        return (<CourseGrid />);
                    }
                    if (store.loadState.isError) {
                        return (<FullCenteredView>
                            <SimpleRetryableAppView className="p-4 sm:p-6" appError={store.loadState.error} onRetry={() => store.loadCourses({ page: store.loadedCurrentPage })} />
                        </FullCenteredView>);
                    }
                    return <CourseGridSkeleton />;
                }}
            </Observer>
        </div>
    );
}

export default function CourseListPage() {
    return (
        <PageProvider>
            <PageInner />
        </PageProvider>
    );
}
