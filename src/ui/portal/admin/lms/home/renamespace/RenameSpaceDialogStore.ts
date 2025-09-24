import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { RenameSpaceReq, RenameSpaceRes } from "~/domain/lms/models/RenameSpaceModels";
import { DataState } from "~/ui/utils/DataState";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { validateInternalName, validateSpaceName } from "../../utils/spaceValidation";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";

export class RenameSpaceDialogStore {

    allSpacesStore: AllSpacesStore;
    onClose: () => void;
    item: AdminSpaceItem;

    nameField: InputValue<string> = new InputValue("");
    internalNameField: InputValue<string> = new InputValue("");
    showAdditionalFields: boolean = false;

    renameState: DataState<RenameSpaceRes> = DataState.init();

    get layoutStore() {
        return this.allSpacesStore.layoutStore;
    }

    get adminSpacesService() {
        return this.layoutStore.adminSpacesService;
    }

    get dialogManager() {
        return this.layoutStore.portalLayoutStore.dialogManager;
    }

    constructor({ allSpacesStore, item, onClose }: { allSpacesStore: AllSpacesStore; item: AdminSpaceItem; onClose: () => void }) {
        this.onClose = onClose;
        this.allSpacesStore = allSpacesStore;
        this.item = item;

        // Initialize fields with current values
        this.nameField = new InputValue(item.name);
        this.internalNameField = new InputValue(item.internalName || "");

        this.nameField.validator = (value) => validateSpaceName({ value: value, label: this.item.type.label });
        this.internalNameField.validator = (value) => validateInternalName({ value: value, label: `${this.item.type.label} internal name` });

        makeObservable(this, {
            renameState: observable.ref,
            showAdditionalFields: observable,
        });
    }

    get typeLabel(): string {
        return this.item.type.label;
    }

    toggleAdditionalFields(): void {
        runInAction(() => {
            this.showAdditionalFields = !this.showAdditionalFields;
        });
    }

    async renameSpace() {
        const fieldsToValidate = [this.nameField];
        if (this.showAdditionalFields) {
            fieldsToValidate.push(this.internalNameField);
        }
        const isValid = InputValuesUtil.validateAll(fieldsToValidate);
        if (!isValid) {
            showErrorToast({
                message: "Please fix the errors in the form.",
            });
            return;
        }

        // Check if anything changed
        const nameChanged = this.nameField.value.trim() !== this.item.name;
        const internalNameChanged = this.internalNameField.value.trim() !== (this.item.internalName || "");

        if (!nameChanged && !internalNameChanged) {
            showErrorToast({
                message: "No changes were made.",
            });
            return;
        }

        try {
            runInAction(() => {
                this.renameState = DataState.loading();
            });
            const req = new RenameSpaceReq({
                id: this.item.id,
                name: this.nameField.value.trim(),
                internalName: this.internalNameField.value.trim() || null,
                avatarColor: this.item.avatarColor,
            });
            const res = (await this.adminSpacesService.renameSpace(this.item.id, req)).getOrError();
            runInAction(() => {
                this.renameState = DataState.data(res);
            });

            // Reload the current state to reflect changes
            this.allSpacesStore.reloadCurrentState();
            this.onClose();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.renameState = DataState.error(appError);
            });
        }
    }

}