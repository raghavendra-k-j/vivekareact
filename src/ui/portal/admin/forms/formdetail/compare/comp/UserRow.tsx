import { GuestBase } from "~/domain/common/models/GuestBase";
import { UserBase } from "~/domain/common/models/UserBase";
import { AvatarView } from "~/ui/components/avatar/AvatarView";

export type UserTileItemProps = {
    user: UserBase | null;
    guest: GuestBase | null;
}

export function UserTileItem(props: UserTileItemProps) {
    let id: number;
    let name: string;
    let email: string;
    if (props.user) {
        id = props.user.id;
        name = props.user.name;
        email = props.user.email;
    }
    else if (props.guest) {
        id = props.guest.id;
        name = props.guest.name;
        email = props.guest.email;
    }
    else {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8">
                <AvatarView id={id} name={name} />
            </div>
            <div className="space-y-0.5">
                <div className="text-base-m font-semibold text-default line-clamp-2">
                    {name}
                </div>
                <div className="text-sm text-secondary line-clamp-2">
                    {email}
                </div>
            </div>
        </div>
    );
}