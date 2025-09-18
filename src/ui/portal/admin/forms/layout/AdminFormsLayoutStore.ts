import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager";

export type AdminFormsLayoutStoreProps = {
    appStore: AppStore;
    dialogManager: DialogManagerStore;
}

export class AdminFormsLayoutStore {

    appStore: AppStore;
    formsService: AdminFormsService;
    dialogManager: DialogManagerStore;

    constructor(props: AdminFormsLayoutStoreProps) {
        this.appStore = props.appStore;
        this.dialogManager = props.dialogManager;
        this.formsService = new AdminFormsService();
    }
}