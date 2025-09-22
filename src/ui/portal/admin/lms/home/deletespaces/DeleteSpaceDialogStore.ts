import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DataState } from "~/ui/utils/DataState";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager/DialogManagerStore";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { deleteSpaceDialogId } from "../dialogIds";

export class DeleteSpaceDialogStore {
    item: AdminSpaceItem;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
    adminSpacesService: AdminSpacesService;
    dialogManager: DialogManagerStore;

    confirmationField: InputValue<string> = new InputValue("");
    deleteState: DataState<any> = DataState.init();

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

        this.confirmationField.validator = (value) => this.validateConfirmation(value);

        makeObservable(this, {
            deleteState: observable.ref,
        });
    }

    get canDelete(): boolean {
        return (
            this.confirmationField.value.trim() === this.item.name &&
            !this.deleteState.isLoading
        );
    }

    validateConfirmation(value: string): string | null {
        if (value.trim() !== this.item.name) {
            return `Must match "${this.item.name}"`;
        }
        return null;
    }

    fillConfirmationText() {
        runInAction(() => {
            this.confirmationField.value = this.item.name;
        });
    }

    async deleteSpace() {
        if (!this.canDelete) return;

        try {
            runInAction(() => {
                this.deleteState = DataState.loading();
            });

            const result = await this.adminSpacesService.deleteSpace(this.item.id);
            result.getOrError();

            runInAction(() => {
                this.deleteState = DataState.data(null);
            });

            // Reload the current folder to reflect changes
            this.allSpacesStore.reloadCurrentFolder();

            this.closeDialog();
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.deleteState = DataState.error(appError);
            });
            showErrorToast({
                message: appError.message,
            });
        }
    }

    closeDialog() {
        this.dialogManager.closeById(deleteSpaceDialogId);
    }
}