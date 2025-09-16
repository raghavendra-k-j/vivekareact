import { makeObservable, observable } from "mobx";
import { AuthUser } from "~/domain/common/models/AuthUser";
import { UserPermissions } from "~/domain/common/models/UserPermissions";
import { LMSLayoutStore } from "../layout/LMSLayoutStore";
import { HomeCurrentView } from "./models/CurrentView";
import { LMSConst } from "~/domain/lms/models/LMSConst";

export class LMSHomePageStore {
    layoutStore: LMSLayoutStore;
    currentView!: HomeCurrentView;

    constructor({ layoutStore }: { layoutStore: LMSLayoutStore }) {
        this.layoutStore = layoutStore;
        this.currentView = this.initCurrentView();
        makeObservable(this, {
            currentView: observable.ref,
        });
    }

    get ed() {
        return this.layoutStore.appStore.entityCatalog.module(LMSConst.MODULE_ID);
    }

    get user(): AuthUser {
        return this.layoutStore.appStore.authUser;
    }

    initCurrentView(): HomeCurrentView {
        if (this.user.hasPermission(UserPermissions.ADMIN_SPACES_ALL)) {
            return HomeCurrentView.allspaces;
        }
        else {
            return HomeCurrentView.mycourses;
        }
    }
}