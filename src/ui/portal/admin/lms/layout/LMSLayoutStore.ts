import { UserPermissions } from "~/domain/common/models/UserPermissions";
import { LMSConst } from "~/domain/lms/models/LMSConst";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { AppStore } from "~/ui/portal/layout/app/AppStore";

export class LMSLayoutStore {

    appStore: AppStore;
    adminSpacesService: AdminSpacesService;
    
    constructor({ appStore }: { appStore: AppStore }) {
        this.appStore = appStore;
        this.adminSpacesService = new AdminSpacesService();
    }

    entity(defIf: string) {
        return this.appStore.entityCatalog.module(LMSConst.MODULE)!.entity(defIf)!;
    }

    get hasAllPermission() {
        return this.appStore.authUser.hasPermission(UserPermissions.ADMIN_SPACES_ALL);
    }

    get hasAssignedPermission() {
        return this.appStore.authUser.hasPermission(UserPermissions.ADMIN_SPACES_ASSIGNED);
    }

    get hasBothPermissions() {
        return this.hasAllPermission && this.hasAssignedPermission;
    }

    get hasAnyPermission() {
        return this.hasAllPermission || this.hasAssignedPermission;
    }


}