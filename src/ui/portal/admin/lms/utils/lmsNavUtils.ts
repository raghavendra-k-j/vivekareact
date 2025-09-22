import { UserPermissions } from "~/domain/common/models/UserPermissions";
import { AppStore } from "~/ui/portal/layout/app/AppStore";

export function navigateToLMSAdminHome({ appStore }: { appStore: AppStore }) {
    const authUser = appStore.authUser;
    const hasLMSPermission = authUser.hasAnyPermission([UserPermissions.ADMIN_LMS_ALL, UserPermissions.ADMIN_LMS_ASSIGNED]);
    if (!hasLMSPermission) {
        throw new Error("User does not have permission to access LMS admin.");
    }
    if (authUser.hasPermission(UserPermissions.ADMIN_LMS_ALL)) {
        appStore.navigate("/console/lms/spaces");
    }
    else {
        appStore.navigate("/console/lms/my-courses");
    }
}