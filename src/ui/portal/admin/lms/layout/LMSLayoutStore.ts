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
        return this.appStore.entityCatalog.module(LMSConst.MODULE_ID)!.entity(defIf)!;
    }

}