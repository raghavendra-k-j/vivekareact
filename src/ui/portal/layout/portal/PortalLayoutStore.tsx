import { NavigateFunction } from "react-router";
import { AuthService } from "~/domain/auth/services/AuthService";
import { AppStore } from "../app/AppStore";

export class PortalLayoutStore {

    appStore: AppStore;
    authService: AuthService;
    navigate: NavigateFunction;

    constructor(params: { appStore: AppStore; authService: AuthService; navigate: NavigateFunction }) {
        this.appStore = params.appStore;
        this.authService = params.authService;
        this.navigate = params.navigate;
    }

    logout() {
        this.authService.removeTokenLocally();
        this.appStore.clearAuth();
        this.navigate('/auth/login');
    }

    changePassword() {
        this.navigate('/auth/change-password');
    }

    navigateToPortal() {
        if (!this.appStore.appUser.appUserType.isAuthUser) {
            return;
        }
        const authUser = this.appStore.authUser;
        if (authUser.role.isAdmin) {
            this.navigate('/console');
        }
        else {
            this.navigate('/');
        }
    }
}