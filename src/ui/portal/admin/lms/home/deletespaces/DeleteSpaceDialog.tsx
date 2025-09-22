import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DialogFooter } from "~/ui/components/dialogs/dialog";
import { DialogCloseButton, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogScaffold
} from "~/ui/widgets/dialogmanager";
import { FTextField } from "~/ui/widgets/form/TextField";
import { DeleteSpaceDialogProvider, useDeleteSpaceDialogStore } from "./DeleteSpaceDialogContext";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";

export interface DeleteSpaceDialogProps {
    item: AdminSpaceItem;
    adminSpacesService: AdminSpacesService;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
}

function DialogInner() {
    const store = useDeleteSpaceDialogStore();
    return (
        <Dialog onClose={() => store.closeDialog()}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-"
                        onClose={<DialogCloseButton onClick={() => store.closeDialog()} />}
                        title="Delete Space"
                    />
                    <DialogForm />
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}

function DialogForm() {
    const store = useDeleteSpaceDialogStore();
    return (
        <div className="space-y-4 p-6">
            <div className="space-y-4">
                <div className="text-sm text-gray-700">
                    Are you sure you want to delete <strong>"{store.item.name}"</strong>? This action cannot be undone.
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Type the space name to confirm deletion:
                    </label>
                    <FTextField
                        field={store.confirmationField}
                        placeholder="Enter space name"
                    />
                    <div className="text-xs text-gray-500">
                        Click on{" "}
                        <button
                            type="button"
                            onClick={() => store.fillConfirmationText()}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {store.item.name}
                        </button>{" "}
                        to fill automatically
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => store.closeDialog()}
                    disabled={store.deleteState.isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    color="danger"
                    onClick={() => store.deleteSpace()}
                    disabled={!store.canDelete || store.deleteState.isLoading}
                >
                    {store.deleteState.isLoading ? "Deleting..." : "Delete"}
                </Button>
            </DialogFooter>
        </div>
    );
}

export function DeleteSpaceDialog(props: DeleteSpaceDialogProps) {
    return (
        <DeleteSpaceDialogProvider {...props}>
            <DialogInner />
        </DeleteSpaceDialogProvider>
    );
}