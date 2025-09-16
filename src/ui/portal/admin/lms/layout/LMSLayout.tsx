import { useRef } from "react";
import { Outlet } from "react-router";
import { UserPermissions } from "~/domain/common/models/UserPermissions";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { AdminForbiddenView } from "../../components/AdminForbiddenView";
import { LMSLayoutContext } from "./LMSLayoutContext";
import { LMSLayoutStore } from "./LMSLayoutStore";

function PageProvider() {
    const storeRef = useRef<LMSLayoutStore | null>(null);
    const appStore = useAppStore();
    const hasLMSPermission = appStore.authUser.hasPermission(UserPermissions.ADMIN_SPACES_ALL) || appStore.authUser.hasPermission(UserPermissions.ADMIN_SPACES_ASSIGNED);

    if (!hasLMSPermission) {
        return (<AdminForbiddenView />);
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

