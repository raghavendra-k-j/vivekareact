import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import { changePassword, logout } from "~/ui/utils/authRedirectUtils";
import { Badge } from "~/ui/widgets/badges/Badge";
import { useAppStore } from "../../layout/app/AppContext";
import { UserAvatar } from "./UserAvatar";

function MenuItems({ children }: { children: React.ReactNode }) {
    return <div className="p-2">{children}</div>;
}

function MenuItem({ children, onClick, colorClass = "text-default", hoverBg = "hover:bg-gray-50" }: {
    children: React.ReactNode,
    onClick: () => void,
    colorClass?: string,
    hoverBg?: string
}) {
    return (
        <button
            className={clsx(
                "w-full text-left px-4 py-2 text-sm rounded transition",
                colorClass,
                hoverBg
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
}


export type ProfileMenuProps = {
    children: React.ReactNode;
}

export const ProfileMenu = ({ children }: ProfileMenuProps) => {
    const appStore = useAppStore();
    return (
        <RadixPopover.Root>
            <RadixPopover.Trigger>
                {children}
            </RadixPopover.Trigger>
            <RadixPopover.Portal>
                <RadixPopover.Content className="bg-surface shadow-xl border border-strong rounded mx-4 my-1 z-50">
                    <ProfileMenuUserDetails />
                    <MenuItems>
                        {appStore.appUser.appUserType.isAuthUser && (<MenuItem onClick={() => changePassword({ appStore: appStore })}>
                            Change Password
                        </MenuItem>)}
                        <MenuItem onClick={() => logout({ appStore: appStore })} colorClass="text-red-600" hoverBg="hover:bg-red-50">
                            Logout
                        </MenuItem>
                    </MenuItems>
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
};



function ProfileMenuUserDetails() {
    const appStore = useAppStore();
    const user = appStore.appUser;
    return (
        <div className="border-b border-default">
            <div className="p-4">
                <div className="flex flex-row items-center gap-4">
                    <div className="w-10 h-10">
                        <UserAvatar id={user.id} name={user.name} />
                    </div>
                    <div>
                        <div className="text-default font-bold">{user.name}</div>
                        <div className="text-sm text-secondary">{user.email}</div>
                    </div>
                </div>
            </div>
            <div className="border-t border-default" />
            {appStore.appUser.appUserType.isAuthUser && (<div className="px-4 py-2">
                <div className="flex flex-row items-center justify-between">
                    <span className="text-sm text-secondary">Role</span>
                    <Badge variant="soft" color="primary">{appStore.authUser.role.name}</Badge>
                </div>
            </div>)}
        </div>
    );
}