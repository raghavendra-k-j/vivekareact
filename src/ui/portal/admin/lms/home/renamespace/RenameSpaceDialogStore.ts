import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { RenameSpaceReq } from "~/domain/lms/models/RenameSpaceModels";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputValuesUtil } from "~/ui/widgets/form/InputValueUtil";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { renameSpaceDialogId } from "../dialogIds";

export class RenameSpaceDialogStore {
    item: AdminSpaceItem;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
    adminSpacesService: AdminSpacesService;
    dialogManager: DialogManagerStore;

    nameField: InputValue<string> = new InputValue("");
    internalNameField: InputValue<string> = new InputValue("");
    renameState: DataState<any> = DataState.init();

    constructor({
        item,
        adminSpacesService,
        layoutStore,
        allSpacesStore,
    }: {
        item: AdminSpaceItem;
        adminSpacesService: AdminSpacesService;
        layoutStore: LMSLayoutStore;
        allSpacesStore: AllSpacesStore;
    }) {
        this.item = item;
        this.layoutStore = layoutStore;
        this.allSpacesStore = allSpacesStore;
        this.adminSpacesService = adminSpacesService;
        this.dialogManager = allSpacesStore.dialogManager;

        // Initialize fields with current values
        this.nameField.value = item.name;
        this.internalNameField.value = item.internalName || "";

        this.nameField.validator = (value) => this.validateName(value);
        this.internalNameField.validator = (value) => this.validateInternalName(value);

        makeObservable(this, {
            renameState: observable.ref,
        });
    }

    get canRename(): boolean {
        return (
            InputValuesUtil.validateAll([this.nameField, this.internalNameField]) &&
            !this.renameState.isLoading &&
            (this.nameField.value !== this.item.name || this.internalNameField.value !== (this.item.internalName || ""))
        );
    }

    validateName(value: string): string | null {
        if (!value.trim()) {
            return "Name is required";
        }
        if (value.length > 100) {
            return "Name must be less than 100 characters";
        }
        return null;
    }

    validateInternalName(value: string): string | null {
        if (value.length > 100) {
            return "Internal name must be less than 100 characters";
        }
        return null;
    }

    async renameSpace() {
        if (!this.canRename) return;

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

            const res = await this.adminSpacesService.renameSpace(this.item.id, req);
            res.getOrError();

            runInAction(() => {
                this.renameState = DataState.data(null);
            });

            // Reload the current folder to reflect changes
            this.allSpacesStore.reloadCurrentFolder();

            this.closeDialog();
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.renameState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
            });
        }
    }

    closeDialog() {
        this.dialogManager.closeById(renameSpaceDialogId);
    }
}