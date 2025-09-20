import { useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { UserPermissions } from "~/domain/common/models/UserPermissions";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { AdminForbiddenView } from "../../components/AdminForbiddenView";
import { AdminFormsLayoutContext } from "./FormsLayoutContext";
import { AdminFormsLayoutStore } from "./FormsLayoutStore";
import { useDialogManager } from "~/ui/widgets/dialogmanager";

function PageProvider() {
    const storeRef = useRef<AdminFormsLayoutStore | null>(null);
    const appStore = useAppStore();
    const dialogManager = useDialogManager();
    const navigation = useNavigate();
    const hasFormsPermission = appStore.authUser.hasAnyPermission(
        [UserPermissions.ADMIN_FORMS, UserPermissions.ADMIN_SPACES_ALL, UserPermissions.ADMIN_SPACES_ASSIGNED]
    );

    if (!hasFormsPermission) {
        return (<AdminForbiddenView />);
    }

    if (!storeRef.current) {
        storeRef.current = new AdminFormsLayoutStore({
            appStore: appStore,
            dialogManager: dialogManager,
            navigation: navigation
        });
    }
    return (
        <AdminFormsLayoutContext.Provider value={storeRef.current}>
            <div className="w-full h-full overflow-y-hidden">
                <Outlet />
            </div>
        </AdminFormsLayoutContext.Provider>
    );
}

export default function AdminFormsLayout() {
    return (<PageProvider />);
}