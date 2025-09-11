import { Navigate, Outlet } from "react-router";
import { useAppStore } from "../_layout/AppContext";

export default function AdminPortalLayout() {
    const appStore = useAppStore();
    if (appStore.hasAdminUser) {
        return <Navigate to="/auth/login" replace />;
    }
    return (<Outlet />);
}