import { AppBarUserAvatar } from "../avatar/AppBarUserAvatar";
import { PortalAppBarLogo } from "./AppBarLogo";

export function AdminAppBar() {
    return (
        <header className="bg-surface shadow border-b border-default flex flex-row items-center justify-between px-4 sm:px-6 h-12 sticky top-0 z-20">
            <div className="flex flex-row items-center gap-2">
                <PortalAppBarLogo />
            </div>
            <div className="flex flex-row items-center gap-4">
                <AppBarUserAvatar />
            </div>
        </header>
    );
}