import { ProfileMenu } from "./ProfileMenu";
import { UserAvatar } from "./UserAvatar";

export const AppBarUserAvatar = () => {
    const user = {
        id: 1,
        name: "John Doe",
        email: "16102000.rghu@gmail.com",
        role: "Admin"
    };
    return (<ProfileMenu><UserAvatar id={user.id} name={user.name} /></ProfileMenu>);
};