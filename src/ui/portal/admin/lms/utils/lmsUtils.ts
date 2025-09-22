import { NavigateFunction } from "react-router";
import { UserPermissions } from "~/domain/common/models/UserPermissions";
import { AppStore } from "~/ui/portal/layout/app/AppStore";

export function hasLMSAdminAccess(appStore: AppStore): boolean {
    return appStore.authUser.hasAnyPermission([
        UserPermissions.ADMIN_LMS_ALL,
        UserPermissions.ADMIN_LMS_ASSIGNED
    ]);
}

export function navigateToLMSAdminHome({ appStore }: { appStore: AppStore }) {
    if (!hasLMSAdminAccess(appStore)) {
        throw new Error("User does not have permission to access LMS admin.");
    }
    const authUser = appStore.authUser;
    if (authUser.hasPermission(UserPermissions.ADMIN_LMS_ALL)) {
        appStore.navigate("/console/lms/spaces");
    }
    else {
        appStore.navigate("/console/lms/my-courses");
    }
}


export function hasLMSBothPermissions({ appStore }: { appStore: AppStore }): boolean {
    return appStore.authUser.hasPermission(UserPermissions.ADMIN_LMS_ALL) &&
        appStore.authUser.hasPermission(UserPermissions.ADMIN_LMS_ASSIGNED);
}


export function adminLMSNavigateToFolder({ naviate, folderPermalink }: { naviate: NavigateFunction, folderPermalink: string | null }) {
    if (folderPermalink === null) {
        naviate('/console/lms/spaces');
    } else {
        naviate(`/console/lms/spaces/${folderPermalink}`);
    }
}

export function adminLMSNavigateToCouse({ naviate, permalink }: { naviate: NavigateFunction, permalink: string }) {
    naviate(`/console/lms/courses/${permalink}/content`);
}