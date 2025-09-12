import { Outlet } from "react-router";
import { AuthNavigate } from "../../components/nav/AuthNavigate";
import { useAppStore } from "../../layout/app/AppContext";

export default function UserPortalLayout() {
    const appStore = useAppStore();
    if (!appStore.hasLoggedInUser) {
        return <AuthNavigate />;
    }
    return (<Outlet />);
}