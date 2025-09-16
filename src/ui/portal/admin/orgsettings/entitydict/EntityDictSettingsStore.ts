import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { DataState } from "~/ui/utils/DataState";
import { OrgSettingsStore } from "../layout/OrgSettingsStore";
import { EntityCatalogDetailVm, EntityModuleDetailVm } from "./models/EntityCatalogDetailVm";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { UpdateEntityCatalogReq, UpdateEntityEntityDict } from "~/domain/orgsettings/models/UpdateEntityCatalogReq";

export class EntityDictSettingsStore {

    appStore: AppStore;
    catalogState: DataState<EntityCatalogDetailVm> = DataState.init();
    layoutStore: OrgSettingsStore;
    _selectedModule: EntityModuleDetailVm | null = null;
    saveState: DataState<void> = DataState.init();

    constructor({ appStore, layoutStore }: { appStore: AppStore, layoutStore: OrgSettingsStore }) {
        this.layoutStore = layoutStore;
        this.appStore = appStore;
        makeObservable(this, {
            catalogState: observable.ref,
            _selectedModule: observable.ref,
            saveState: observable.ref,
        });
    }

    get catalog(): EntityCatalogDetailVm {
        return this.catalogState.data!;
    }

    get selectedModule(): EntityModuleDetailVm {
        return this._selectedModule!;
    }

    async loadCatalog() {
        try {
            runInAction(() => {
                this.catalogState = DataState.loading();
            });
            const res = (await this.layoutStore.orgSettingsService.getEntityCatalog()).getOrError();
            const vm = EntityCatalogDetailVm.fromModel(res);
            runInAction(() => {
                this._selectedModule = vm.modules[0]!;
                this.catalogState = DataState.data(vm);
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.catalogState = DataState.error(appError);
            });
        }
    }

    setModule(module: EntityModuleDetailVm | null) {
        runInAction(() => {
            this._selectedModule = module;
        });
    }

    async saveChanges() {
        const formFields = new Map<string, InputValue<string>>();
        for (const entity of this.selectedModule.entities) {
            formFields.set(entity.base.id + "_singular", entity.nameSingularField);
            formFields.set(entity.base.id + "_plural", entity.namePluralField);
        }
        const isValid = InputValuesUtil.validateAll(Array.from(formFields.values()));
        if (!isValid) {
            showErrorToast({
                message: "Please correct the errors in the form before saving.",
                description: "Some fields have invalid values. Please review and correct them."
            });
            return;
        }
        try {
            runInAction(() => {
                this.saveState = DataState.loading();
            });
            const entityItems = this.selectedModule.entities.map((entity) => {
                return new UpdateEntityEntityDict({
                    defId: entity.base.defId,
                    nameSingular: entity.nameSingularField.value,
                    namePlural: entity.namePluralField.value,
                });
            });
            const req = new UpdateEntityCatalogReq({ entities: entityItems });
            const res = (await this.layoutStore.orgSettingsService.saveEntityCatalogChanges(req)).getOrError();
            const vm = EntityCatalogDetailVm.fromModel(res);
            runInAction(() => {
                this._selectedModule = vm.modules.find(m => m.base.id === this.selectedModule.base.id)!;
                this.catalogState = DataState.data(vm);
                this.saveState = DataState.data(undefined);
                showSuccessToast({ message: "Changes saved successfully."});
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.saveState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
                description: appError.description
            });
        }
    }


}