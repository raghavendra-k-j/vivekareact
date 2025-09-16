import { useRef } from "react";
import { useLMSStore } from "../layout/LMSLayoutContext";
import { LMSHomePageContext, useLMSHomePageStore } from "./LMSHomePageContext";
import { LMSHomePageStore } from "./LMSHomePageStore";
import { HomeAppBar } from "./components/AppBar";
import { Observer } from "mobx-react-lite";
import { MyCoursesPage } from "./mycourses/MyCoursesPage";
import { AllSpacesPage } from "./allspaces/AllSpacesPage";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<LMSHomePageStore | null>(null);
    const lmsStore = useLMSStore();
    if (!storeRef.current) {
        storeRef.current = new LMSHomePageStore({
            layoutStore: lmsStore,
        });
    }
    return (
        <LMSHomePageContext.Provider value={storeRef.current}>
            {children}
        </LMSHomePageContext.Provider>
    );
}


export default function LMSHomePage() {
    return (<PageProvider>
        <MainContent />
    </PageProvider>);
}


function MainContent() {
    const store = useLMSHomePageStore();
    return (<div className="flex-1 min-h-0 overflow-y-auto">
        <Observer>
            {() => {
                if (store.currentView.isAllSpaces) {
                    return <AllSpacesPage />;
                }
                else {
                    return <MyCoursesPage />;
                }
            }}
        </Observer>
    </div>);
}

