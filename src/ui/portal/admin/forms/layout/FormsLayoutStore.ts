import { NavigateFunction } from "react-router";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager";

export type AdminFormsLayoutStoreProps = {
    appStore: AppStore;
    dialogManager: DialogManagerStore;
    navigation: NavigateFunction;
}

export class AdminFormsLayoutStore {


    appStore: AppStore;
    formsService: AdminFormsService;
    dialogManager: DialogManagerStore;
    navigation: NavigateFunction;


    constructor(props: AdminFormsLayoutStoreProps) {
        this.appStore = props.appStore;
        this.dialogManager = props.dialogManager;
        this.formsService = new AdminFormsService();
        this.navigation = props.navigation;
    }

    goToFormDetails({ permalink }: { permalink: string }) {
        this.navigation(`/console/forms/${permalink}`);
    }

}