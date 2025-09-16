import { useRef } from "react";
import { Outlet } from "react-router";
import { useLMSStore } from "../layout/LMSLayoutContext";
import { LMSHomePageContext } from "./LMSHomePageContext";
import { LMSHomePageStore } from "./LMSHomePageStore";

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
        <Outlet />
    </PageProvider>);
}
