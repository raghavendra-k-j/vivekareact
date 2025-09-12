import { useAppStore } from "../../layout/app/AppContext";
import { ProfileMenu } from "./ProfileMenu";
import { UserAvatar } from "./UserAvatar";

export const AppBarUserAvatar = () => {
    const appStore = useAppStore();
    if (!appStore.hasUser) {
        return null;
    }


    const user = appStore.appUser;
    return (<ProfileMenu>
        <UserAvatar id={user.id} name={user.name} />
    </ProfileMenu>);
};