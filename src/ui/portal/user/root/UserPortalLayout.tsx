import { Outlet } from "react-router";
import { AuthNavigate } from "../../components/nav/AuthNavigate";
import { useAppStore } from "../../layout/app/AppContext";
import { usePortalLayoutStore } from "../../layout/portal/PortalLayoutContext";

export default function UserPortalLayout() {
    const appStore = useAppStore();
    const portalLayoutStore = usePortalLayoutStore();
    if (!appStore.hasLoggedInUser) {
        return <AuthNavigate />;
    }
    if (!appStore.authUser.role.isUser) {
        portalLayoutStore.logout();
    }
    return (<Outlet />);
}