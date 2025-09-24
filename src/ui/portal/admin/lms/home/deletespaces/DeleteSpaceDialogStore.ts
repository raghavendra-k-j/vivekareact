import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { DataState } from "~/ui/utils/DataState";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";

export class DeleteSpaceDialogStore {

    allSpacesStore: AllSpacesStore;
    onClose: () => void;
    item: AdminSpaceItem;

    confirmationTextField: InputValue<string> = new InputValue("");

    confirmationChecked: boolean = false;

    deleteState: DataState<void> = DataState.init();

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

        makeObservable(this, {
            deleteState: observable.ref,
            confirmationChecked: observable,
        });
    }

    get typeLabel(): string {
        return this.item.type.label;
    }

    get isConfirmationValid(): boolean {
        return this.confirmationChecked;
    }

    async deleteSpace() {
        if (!this.isConfirmationValid) {
            showErrorToast({
                message: "Please confirm the deletion by checking the checkbox.",
            });
            return;
        }

        try {
            runInAction(() => {
                this.deleteState = DataState.loading();
            });

            (await this.adminSpacesService.deleteSpace(this.item.id)).getOrError();

            runInAction(() => {
                this.deleteState = DataState.data(undefined);
            });

            // Reload the current state to reflect changes
            this.allSpacesStore.reloadCurrentState();
            this.onClose();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.deleteState = DataState.error(appError);
            });
        }
    }

}