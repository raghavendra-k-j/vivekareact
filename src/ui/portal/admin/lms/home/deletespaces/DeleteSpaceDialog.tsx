import { Observer } from "mobx-react-lite";
import { ReactNode, useRef } from "react";
import { DialogFooter } from "~/ui/components/dialogs/dialog";
import { DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogScaffold
} from "~/ui/widgets/dialogmanager";
import { Checkbox } from "~/ui/widgets/form/Checkbox";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { DeleteSpaceDialogContext, useDeleteSpaceDialogStore } from "./DeleteSpaceDialogContext";
import { DeleteSpaceDialogStore } from "./DeleteSpaceDialogStore";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";

export interface DeleteSpaceDialogProps {
    item: AdminSpaceItem;
    allSpacesStore: AllSpacesStore;
    onClose: () => void;
}

function DialogInner() {
    const store = useDeleteSpaceDialogStore();
    return (
        <Dialog onClose={() => store.onClose()}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-none"
                        title={`Delete ${store.typeLabel}`}
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
            <Observer>
                {() => (
                    <Checkbox
                        className="text-base"
                        value={store.confirmationChecked}
                        onChange={(checked) => store.confirmationChecked = checked}
                        label="I understand that deleting this will also delete all its relevant data and proceed further"
                    />
                )}
            </Observer>

            <DialogFooter>
                <Button
                    variant="outline"
                    color="secondary"
                    onClick={() => store.onClose()}>
                    Cancel
                </Button>
                <Observer>
                    {() => (
                        <Button
                            color="danger"
                            onClick={() => store.deleteSpace()}
                            loading={store.deleteState.isLoading}
                            disabled={!store.isConfirmationValid}
                        >
                            Delete
                        </Button>
                    )}
                </Observer>
            </DialogFooter>
        </div>
    );
}

export function DeleteSpaceDialogProvider({
    children,
    store
}: {
    children: ReactNode;
    store: DeleteSpaceDialogStore;
}) {
    return (
        <DeleteSpaceDialogContext.Provider value={store}>
            {children}
        </DeleteSpaceDialogContext.Provider>
    );
}

export function DeleteSpaceDialog(props: DeleteSpaceDialogProps) {
    const storeRef = useRef<DeleteSpaceDialogStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new DeleteSpaceDialogStore({
            item: props.item,
            allSpacesStore: props.allSpacesStore,
            onClose: props.onClose,
        });
    }
    return (
        <DeleteSpaceDialogProvider store={storeRef.current}>
            <DialogInner />
        </DeleteSpaceDialogProvider>
    );
}