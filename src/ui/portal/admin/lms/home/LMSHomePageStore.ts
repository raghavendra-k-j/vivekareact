import { AuthUser } from "~/domain/common/models/AuthUser";
import { LMSLayoutStore } from "../layout/LMSLayoutStore";

export class LMSHomePageStore {
    layoutStore: LMSLayoutStore;

    constructor({ layoutStore }: { layoutStore: LMSLayoutStore }) {
        this.layoutStore = layoutStore;
    }

    get user(): AuthUser {
        return this.layoutStore.appStore.authUser;
    }
}