import { AppStore } from "../portal/layout/app/AppStore";

export function logout({ appStore }: { appStore: AppStore }) {
    appStore.authService.removeTokenLocally();
    appStore.clearAuth();
    appStore.navigate('/auth/login');
}

export function changePassword({ appStore }: { appStore: AppStore }) {
    appStore.navigate('/auth/change-password');
}

export function navigateToPortal({ appStore }: { appStore: AppStore }) {
    const navigate = appStore.navigate;
    if (!appStore.appUser.appUserType.isAuthUser) {
        return;
    }
    const authUser = appStore.authUser;
    if (authUser.role.isAdmin) {
        navigate('/console');
    }
    else {
        navigate('/');
    }
}