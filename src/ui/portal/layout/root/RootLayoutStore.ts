import { NavigateFunction } from "react-router";
import { AppStore } from "../app/AppStore";

export class RootLayoutStore {

    navigate: NavigateFunction;

    constructor({ navigate }: { navigate: NavigateFunction }) {
        this.navigate = navigate;
    }

    navigateToPortal({ appStore }: { appStore: AppStore; }) {
        if (!appStore.hasLoggedInUser) {
            return null;
        }
        if (appStore.authUser.role.isAdmin) {
            this.navigate("/console");
        }
        else {
            this.navigate("/");
        }
    }

}