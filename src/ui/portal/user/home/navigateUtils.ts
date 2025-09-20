import { AppStore } from "../../layout/app/AppStore";
import { UserPortalStore } from "../root/UserPortalStore";

export function navigateToDefault({ appStore, userPortalStore }: { appStore: AppStore, userPortalStore: UserPortalStore }) {
    const defaultNavItem = userPortalStore.defaultNavItem;
    if (defaultNavItem) {
        appStore.navigate(defaultNavItem.webRoute);
    }
}