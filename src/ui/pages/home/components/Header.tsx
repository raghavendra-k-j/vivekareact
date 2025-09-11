import { Bell, Menu } from "lucide-react";
import { BaseNamedLogo } from "~/ui/components/logo/BaseLogo";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { UserAppBar } from "../../portallayout/appbar/UserAppBar";

export function AppHeader() {
    return (<UserAppBar />);
}


function BrandingAndMenu() {
    return (<div className="flex flex-row items-center gap-4">
        <Menu className="w-6 h-6 text-gray-700" />
        <BaseNamedLogo />
    </div>);
}

function RightContent() {
    return (<div className="flex flex-row items-center gap-4">
        <NotificationButton />
        <ProfileAvatarView />
    </div>);
}



function ProfileAvatarView() {
    return (<div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
        U
    </div>);
}


function NotificationButton() {
    return (<IconButton
        variant="ghost"
        color="secondary"
        icon={<Bell className="w-5 h-5" />}
    />);
}