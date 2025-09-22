import { ReactNode, useEffect, useRef } from "react";
import { useCourseLayoutStore } from "../layout/CourseLayoutContext";
import { TopicsContext, useTopicsStore } from "./TopicsContext";
import { TopicsStore } from "./TopicsStore";
import { HeaderView } from "./components/HeaderView";
import { MainTableView } from "./components/MainTableView";
import TopicDialog from "./components/TopicDialog";

export function TopicsProvider({ children }: { children: ReactNode }) {
    const layoutStore = useCourseLayoutStore();
    const storeRef = useRef<TopicsStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new TopicsStore({
            layoutStore: layoutStore
        });
    }
    return (
        <TopicsContext.Provider value={storeRef.current}>
            {children}
        </TopicsContext.Provider>
    );
}

function TopicsPageInner() {
    const store = useTopicsStore();
    useEffect(() => {
        store.loadTopics({ page: 1 });
    }, [store]);

    return (
        <div className="flex flex-col h-full min-h-0 overflow-y-hidden">
            <HeaderView />
            <MainTableView />
            <TopicDialog dialogStore={store.topicDialogStore} />
        </div>
    );
}

export default function TopicsPage() {
    return (
        <TopicsProvider>
            <TopicsPageInner />
        </TopicsProvider>
    );
}