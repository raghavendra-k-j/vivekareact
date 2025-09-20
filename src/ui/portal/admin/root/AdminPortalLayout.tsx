import { Outlet } from "react-router";
import { logout } from "~/ui/utils/authRedirectUtils";
import { AuthNavigate } from "../../components/nav/AuthNavigate";
import { useAppStore } from "../../layout/app/AppContext";
import { AdminSidebar } from "../components/sidebar/AdminSidebar";

export default function AdminPortalLayout() {
    const appStore = useAppStore();
    if (!appStore.hasLoggedInUser) {
        return <AuthNavigate />;
    }
    if (appStore.authUser.role.isAdmin !== true) {
        logout({appStore: appStore});
        return null;
    }
    return (
        <div className="flex flex-row h-full overflow-hidden">
            <AdminSidebar />
            <Outlet />
        </div>
    );
}