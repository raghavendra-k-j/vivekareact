import { AppStore } from "../app/AppStore";

export class PortalLayoutStore {

    appStore: AppStore;

    constructor(params: { appStore: AppStore }) {
        this.appStore = params.appStore;
    }
}