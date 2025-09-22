import { ReactNode, useEffect, useRef } from "react";
import { useCourseLayoutStore } from "../layout/CourseLayoutContext";
import { MembersContext, useMembersStore } from "./MembersContext";
import { MembersStore } from "./MembersStore";
import { HeaderView } from "./components/HeaderView";
import { MainTableView } from "./components/MainTableView";

export function MembersProvider({ children }: { children: ReactNode }) {
    const layoutStore = useCourseLayoutStore();
    const storeRef = useRef<MembersStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new MembersStore({
            layoutStore: layoutStore
        });
    }
    return (
        <MembersContext.Provider value={storeRef.current}>
            {children}
        </MembersContext.Provider>
    );
}

function MembersPageInner() {
    const store = useMembersStore();
    useEffect(() => {
        store.loadMembers({ page: 1 });
    }, [store]);

    return (
        <div className="flex flex-col h-full min-h-0 overflow-y-hidden">
            <HeaderView />
            <MainTableView />
        </div>
    );
}

export default function MembersPage() {
    return (
        <MembersProvider>
            <MembersPageInner />
        </MembersProvider>
    );
}
