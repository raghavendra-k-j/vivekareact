import { PortalAppBarLogo } from "~/ui/portal/components/appbar/PortalAppBarLogo";
import { UserBaseAppBar } from "../../shared/components/appbar/UserBaseAppBar";
import { AppBarUserAvatar } from "~/ui/portal/components/avatar/AppBarUserAvatar";

export function CourseDetailAppBar() {
    return (
        <UserBaseAppBar className="">
            <div className="flex flex-row items-center justify-between px-4 sm:px-6 py-2 min-h-12">
                <div>
                    <PortalAppBarLogo />
                </div>
                <AppBarUserAvatar />
            </div>
        </UserBaseAppBar>
    );
}