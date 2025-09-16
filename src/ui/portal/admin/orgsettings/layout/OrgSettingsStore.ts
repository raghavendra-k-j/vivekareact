import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { EntityCatalogService } from "~/domain/entitydict/services/EntityCatalogService";
import { OrgGeneralSettingsRes } from "~/domain/orgsettings/models/OrgGeneralSettingsRes";
import { AdminOrgSettingsService } from "~/domain/orgsettings/services/AdminOrgSettingsService";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { DataState } from "~/ui/utils/DataState";

export class OrgSettingsStore {

    orgSettingsService: AdminOrgSettingsService;
    orgSettingsState: DataState<OrgGeneralSettingsRes> = DataState.init();
    appStore: AppStore;
    entityDictService: EntityCatalogService;

    get orgSettings(): OrgGeneralSettingsRes {
        return this.orgSettingsState.data!;
    }

    constructor({ appStore }: { appStore: AppStore }) {
        this.orgSettingsService = new AdminOrgSettingsService();
        this.entityDictService = new EntityCatalogService();
        this.appStore = appStore;
        makeObservable(this, {
            orgSettingsState: observable.ref
        });
    }

    async loadGeneralSettings() {
        try {
            runInAction(() => {
                this.orgSettingsState = DataState.loading();
            });
            const res = (await this.orgSettingsService.getGeneralSettings()).getOrError();
            runInAction(() => {
                this.orgSettingsState = DataState.data(res);
                const newOrgConfig = this.appStore.orgConfig.org.copyWith({ logoUrl: res.logoUrl, name: res.orgName, subdomain: res.subdomain });
                this.appStore.updateOrg(newOrgConfig);
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.orgSettingsState = DataState.error(appError);
            });
        }
    }




}
