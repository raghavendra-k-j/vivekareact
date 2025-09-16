import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DialogFooter } from "~/ui/components/dialog";
import { DialogCloseButton, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogScaffold
} from "~/ui/widgets/dialogmanager";
import { useDialogManager } from "~/ui/widgets/dialogmanager/DialogManagerContext";
import { FTextField } from "~/ui/widgets/form/TextField";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { CreateSpaceDialogProvider, useCreateSpaceDialogStore } from "./CreateSpaceDialogContext";
import { CreateSpaceDialogStore } from "./CreateSpaceDialogStore";

export interface CreateSpaceDialogProps {
    type: SpaceType;
    parentId: number | null;
    adminSpacesService: AdminSpacesService;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
}

function DialogInner() {
    const store = useCreateSpaceDialogStore();
    return (
        <Dialog onClose={() => store.closeDialog()}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-"
                        onClose={<DialogCloseButton onClick={() => store.closeDialog()} />}
                        title={`Create New ${store.typeLabel}`}
                    />
                    <DialogForm />
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}


function DialogForm() {
    const store = useCreateSpaceDialogStore();
    return (<div className="space-y-4 p-6">
        <FTextField
            required
            label="Name"
            placeholder="Enter name"
            field={store.nameField}
        />
        <Observer>
            {() =>
                store.type.isCourse ? (
                    <button
                        type="button"
                        onClick={() => store.toggleAdditionalFields()}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                        {store.showAdditionalFields ? "Hide additional fields" : "Show additional fields"}
                    </button>
                ) : null
            }
        </Observer>
        <Observer>
            {() =>
                (store.type.isCourse && store.showAdditionalFields) ? (
                    <>
                        <FTextField
                            label="Internal Name"
                            placeholder="Enter internal name"
                            field={store.internalNameField}
                        />
                        <FTextField
                            label="Code"
                            placeholder="Enter code"
                            field={store.codeField}
                        />
                    </>
                ) : null
            }
        </Observer>

        <DialogFooter>
            <Button variant="outline" onClick={() => store.closeDialog()}>
                Cancel
            </Button>
            <Observer>
                {() => (
                    <Button
                        onClick={() => store.createSpace()}
                        loading={store.createState.isLoading}
                    >
                        Create
                    </Button>
                )}
            </Observer>
        </DialogFooter>
    </div>);
}


export function CreateSpaceDialog(props: CreateSpaceDialogProps) {
    const storeRef = useRef<CreateSpaceDialogStore | null>(null);
    const dialogManager = useDialogManager();
    if (!storeRef.current) {
        storeRef.current = new CreateSpaceDialogStore({
            adminSpacesService: props.adminSpacesService,
            type: props.type,
            parentId: props.parentId,
            layoutStore: props.layoutStore,
            allSpacesStore: props.allSpacesStore,
            dialogManager: dialogManager,
        });
    }
    return (
        <CreateSpaceDialogProvider store={storeRef.current}>
            <DialogInner />
        </CreateSpaceDialogProvider>
    );
}