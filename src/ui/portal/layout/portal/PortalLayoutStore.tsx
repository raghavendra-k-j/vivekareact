import { DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { AppStore } from "../app/AppStore";

export class PortalLayoutStore {

    appStore: AppStore;
    dialogManager: DialogManagerStore;

    constructor(params: { appStore: AppStore, dialogManager: DialogManagerStore }) {
        this.appStore = params.appStore;
        this.dialogManager = params.dialogManager;
    }
}