import { Outlet } from "react-router";
import { AuthNavigate } from "../../components/nav/AuthNavigate";
import { usePortalLayoutStore } from "../../layout/portal/PortalLayoutContext";
import { useAppStore } from "../../layout/app/AppContext";

export default function AdminPortalLayout() {
    const appStore = useAppStore();
    const portalLayout = usePortalLayoutStore();
    if (!appStore.hasLoggedInUser) {
        return <AuthNavigate />;
    }
    if (appStore.authUser.role.isAdmin !== true) {
        portalLayout.logout();
        return null;
    }
    return (<Outlet />);
}