import { ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { AdminMyCoursesContext, useAdminMyCoursesStore } from "./MyCoursesContext";
import { useDialogManager } from "~/ui/widgets/dialogmanager";
import { useLMSStore } from "../../layout/LMSLayoutContext";
import { AdminMyCoursesStore } from "./MyCoursesStore";
import { AppBarView } from "./components/HeaderView";
import { MainTableView } from "./components/MainTableView";

export function MyCoursesProvider({ children }: { children: ReactNode }) {
    const layoutStore = useLMSStore();
    const dialogManager = useDialogManager();
    const navigate = useNavigate();
    const storeRef = useRef<AdminMyCoursesStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new AdminMyCoursesStore({
            layoutStore: layoutStore,
            dialogManager: dialogManager,
            navigate: navigate
        });
    }
    return (
        <AdminMyCoursesContext.Provider value={storeRef.current}>
            {children}
        </AdminMyCoursesContext.Provider>
    );
}

function MyCoursesPageInner() {
    const store = useAdminMyCoursesStore();
    useEffect(() => {
        store.loadItems({ page: 1 });
    }, [store]);

    return (
        <div className="flex flex-col h-full min-h-0 overflow-y-hidden">
            <AppBarView />
            <MainTableView />
        </div>
    );
}

export default function MyCoursesPage() {
    return (
        <MyCoursesProvider>
            <MyCoursesPageInner />
        </MyCoursesProvider>
    );
}

