import { PortalAppBarLogo } from "../../components/appbar/PortalAppBarLogo";
import { AppBarUserAvatar } from "../../components/avatar/AppBarUserAvatar";
import { NotificationBell } from "../notifications/NotificationBell";

export function UserAppBar() {
    return (
        <header className="bg-surface shadow border-b border-default flex flex-row items-center justify-between px-4 sm:px-6 h-12 sticky top-0 z-20">
            <div className="flex flex-row items-center gap-2">
                <PortalAppBarLogo />
            </div>
            <div className="flex flex-row items-center gap-4">
                <NotificationBell />
                <AppBarUserAvatar />
            </div>
        </header>
    );
}