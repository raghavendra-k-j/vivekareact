import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import { Badge } from "~/ui/widgets/badges/Badge";
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
export const AppBarProfileMenu = () => {
    const user = {
        id: 1,
        name: "John Doe",
        email: "16102000.rghu@gmail.com",
        role: "Admin"
    };

    return (
        <RadixPopover.Root>
            <RadixPopover.Trigger>
                <UserAvatar id={user.id} name={user.name} />
            </RadixPopover.Trigger>
            <RadixPopover.Portal>
                <RadixPopover.Content className="bg-surface shadow-xl border border-default rounded-md m-2">
                    <UserDetails user={user} />
                    <MenuItems>
                        <MenuItem onClick={() => { }}>
                            Change Password
                        </MenuItem>
                        <MenuItem onClick={() => { }} colorClass="text-red-600" hoverBg="hover:bg-red-50">
                            Logout
                        </MenuItem>
                    </MenuItems>
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
};



function UserDetails({ user }: { user: { id: number, name: string, email: string, role: string } }) {
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
            <div className="px-4 py-2">
                <div className="flex flex-row items-center justify-between">
                    <span className="text-sm text-secondary">Role</span>
                    <Badge variant="soft" color="primary">{user.role}</Badge>
                </div>
            </div>
        </div>
    );
}