import { ReactNode, useEffect, useRef } from "react";
import { useCourseLayoutStore } from "../layout/CourseLayoutContext";
import { ContentContext, useContentStore } from "./ContentContext";
import { ContentStore } from "./ContentStore";
import { HeaderView } from "./components/HeaderView";
import { MainTableView } from "./components/MainTableView";


export function ContentProvider({ children }: { children: ReactNode }) {
    const layoutStore = useCourseLayoutStore();
    const storeRef = useRef<ContentStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new ContentStore({
            layoutStore: layoutStore
        });
    }
    return (
        <ContentContext.Provider value={storeRef.current}>
            {children}
        </ContentContext.Provider>
    );
}

function ContentPageInner() {
    const store = useContentStore();
    useEffect(() => {
        store.loadContents({ page: 1 });
    }, [store]);

    return (
        <div className="flex flex-col h-full min-h-0 overflow-y-hidden">
            <HeaderView />
            <MainTableView />
        </div>
    );
}

export default function ContentPage() {
    return (
        <ContentProvider>
            <ContentPageInner />
        </ContentProvider>
    );
}