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
import { RenameSpaceDialogProvider, useRenameSpaceDialogStore } from "./RenameSpaceDialogContext";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";

export interface RenameSpaceDialogProps {
    item: AdminSpaceItem;
    adminSpacesService: AdminSpacesService;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
}

function DialogInner() {
    const store = useRenameSpaceDialogStore();
    return (
        <Dialog onClose={() => store.closeDialog()}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-"
                        onClose={<DialogCloseButton onClick={() => store.closeDialog()} />}
                        title="Rename Space"
                    />
                    <DialogForm />
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}

function DialogForm() {
    const store = useRenameSpaceDialogStore();
    return (
        <div className="space-y-4 p-6">
            <div className="space-y-4">
                <FTextField
                    label="Name"
                    field={store.nameField}
                    placeholder="Enter space name"
                />
                <FTextField
                    label="Internal Name"
                    field={store.internalNameField}
                    placeholder="Enter internal name"
                />
            </div>
            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => store.closeDialog()}
                    disabled={store.renameState.isLoading}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    color="primary"
                    onClick={() => store.renameSpace()}
                    disabled={!store.canRename || store.renameState.isLoading}
                >
                    {store.renameState.isLoading ? "Renaming..." : "Rename"}
                </Button>
            </DialogFooter>
        </div>
    );
}

export function RenameSpaceDialog(props: RenameSpaceDialogProps) {
    return (
        <RenameSpaceDialogProvider {...props}>
            <DialogInner />
        </RenameSpaceDialogProvider>
    );
}