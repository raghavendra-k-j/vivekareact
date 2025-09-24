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
import { FTextField } from "~/ui/widgets/form/TextField";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { RenameSpaceDialogContext, useRenameSpaceDialogStore } from "./RenameSpaceDialogContext";
import { RenameSpaceDialogStore } from "./RenameSpaceDialogStore";
import { HyperLink } from "~/ui/widgets/button/HyperLink";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";

export interface RenameSpaceDialogProps {
    item: AdminSpaceItem;
    allSpacesStore: AllSpacesStore;
    onClose: () => void;
}

function DialogInner() {
    const store = useRenameSpaceDialogStore();
    return (
        <Dialog onClose={() => store.onClose()}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-none"
                        title={`Rename ${store.typeLabel}`}
                    />
                    <DialogForm />
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}

function DialogForm() {
    const store = useRenameSpaceDialogStore();
    return (<div className="space-y-4 p-6">
        <FTextField
            required
            label="Name"
            placeholder={`Enter ${store.typeLabel.toLowerCase()} name`}
            field={store.nameField}
        />
        <Observer>
            {() =>
                store.item.type.isCourse ? (
                    <HyperLink onClick={() => store.toggleAdditionalFields()}>
                        <button>{store.showAdditionalFields ? "Hide additional fields" : "Show additional fields"}</button>
                    </HyperLink>
                ) : null
            }
        </Observer>
        <Observer>
            {() =>
                (store.item.type.isCourse && store.showAdditionalFields) ? (
                    <>
                        <FTextField
                            label="Internal Name"
                            placeholder="Enter internal name"
                            field={store.internalNameField}
                        />
                    </>
                ) : null
            }
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
                        onClick={() => store.renameSpace()}
                        loading={store.renameState.isLoading}
                    >
                        Rename
                    </Button>
                )}
            </Observer>
        </DialogFooter>
    </div>);
}

export function RenameSpaceDialogProvider({
    children,
    store
}: {
    children: ReactNode;
    store: RenameSpaceDialogStore;
}) {
    return (
        <RenameSpaceDialogContext.Provider value={store}>
            {children}
        </RenameSpaceDialogContext.Provider>
    );
}

export function RenameSpaceDialog(props: RenameSpaceDialogProps) {
    const storeRef = useRef<RenameSpaceDialogStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new RenameSpaceDialogStore({
            item: props.item,
            allSpacesStore: props.allSpacesStore,
            onClose: props.onClose,
        });
    }
    return (
        <RenameSpaceDialogProvider store={storeRef.current}>
            <DialogInner />
        </RenameSpaceDialogProvider>
    );
}