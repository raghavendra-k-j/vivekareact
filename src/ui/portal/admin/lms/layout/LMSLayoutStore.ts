import { LMSConst } from "~/domain/lms/models/LMSConst";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { AppStore } from "~/ui/portal/layout/app/AppStore";

export class LMSLayoutStore {

    appStore: AppStore;
    adminSpacesService: AdminSpacesService;
    adminCourseService: AdminCourseService;

    constructor({ appStore }: { appStore: AppStore }) {
        this.appStore = appStore;
        this.adminSpacesService = new AdminSpacesService();
        this.adminCourseService = new AdminCourseService();
    }

    ed(defIf: string) {
        return this.appStore.entityCatalog.module(LMSConst.MODULE)!.entity(defIf)!;
    }

    courseEd() {
        return this.ed(LMSConst.ENTITY_COURSE);
    }

    get courseLabelPlural(): string {
        return this.courseEd().namePlural;
    }

    get courseLabelSingular(): string {
        return this.courseEd().nameSingular;
    }

    get adminLabelPlural(): string {
        return this.ed(LMSConst.ENTITY_ADMIN).namePlural;
    }

    get adminLabelSingular(): string {
        return this.ed(LMSConst.ENTITY_ADMIN).nameSingular;
    }

    get userLabelPlural(): string {
        return this.ed(LMSConst.ENTITY_USER).namePlural;
    }

    get userLabelSingular(): string {
        return this.ed(LMSConst.ENTITY_USER).nameSingular;
    }
}