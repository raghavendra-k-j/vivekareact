import { ReactNode, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { AllSpacesContext, useAllSpacesStore } from "./AllSpacesContext";
import { useDialogManager } from "~/ui/widgets/dialogmanager";
import { useLMSStore } from "../../layout/LMSLayoutContext";
import { AllSpacesStore } from "./AllSpacesStore";
import { AppBarView } from "./components/HeaderView";
import { MainTableView } from "./components/MainTableView";


export function AllSpacesProvider({ children }: { children: ReactNode }) {
    const layoutStore = useLMSStore();
    const dialogManager = useDialogManager();
    const storeRef = useRef<AllSpacesStore | null>(null);
    const { permalink } = useParams<{ permalink: string | undefined }>();
    if (!storeRef.current || storeRef.current.currentFolderPermalink !== permalink) {
        storeRef.current = new AllSpacesStore({
            layoutStore: layoutStore,
            dialogManager: dialogManager,
            permalink: permalink || null
        });
    }
    return (
        <AllSpacesContext.Provider value={storeRef.current}>
            {children}
        </AllSpacesContext.Provider>
    );
}

function AllSpacesPageInner() {
    const store = useAllSpacesStore();
    useEffect(() => {
        store.loadItems({ parentPermalink: store.currentFolderPermalink, page: 1 });
    }, [store, store.currentFolderPermalink]);

    return (
        <div className="flex flex-col h-full min-h-0 overflow-y-hidden">
            <AppBarView />
            <MainTableView />
        </div>
    );
}

export default function AllSpacesPage() {
    return (
        <AllSpacesProvider>
            <AllSpacesPageInner />
        </AllSpacesProvider>
    );
}