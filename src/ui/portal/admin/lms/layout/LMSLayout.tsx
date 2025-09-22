import { useRef } from "react";
import { Outlet } from "react-router";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { AdminForbiddenView } from "../../components/AdminForbiddenView";
import { LMSLayoutContext } from "./LMSLayoutContext";
import { LMSLayoutStore } from "./LMSLayoutStore";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { hasLMSAdminAccess } from "../utils/lmsUtils";

function PageProvider() {
    const storeRef = useRef<LMSLayoutStore | null>(null);
    const appStore = useAppStore();

    if (!hasLMSAdminAccess(appStore)) {
        return (<FullCenteredView>
            <AdminForbiddenView />
        </FullCenteredView>);
    }

    if (!storeRef.current) {
        storeRef.current = new LMSLayoutStore({
            appStore: appStore,
        });
    }
    return (
        <LMSLayoutContext.Provider value={storeRef.current}>
            <Outlet />
        </LMSLayoutContext.Provider>
    );
}


export default function LMSLayout() {
    return (<div className="w-full h-full flex-1 flex flex-col min-h-0">
        <PageProvider />
    </div>);
}
