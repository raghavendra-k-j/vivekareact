import { Observer } from "mobx-react-lite";
import { ReactNode, useRef } from "react";
import { SpaceType } from "~/domain/lms/models/SpaceType";
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
import { CreateSpaceDialogContext, useCreateSpaceDialogStore } from "./CreateSpaceDialogContext";
import { CreateSpaceDialogStore } from "./CreateSpaceDialogStore";
import { HyperLink } from "~/ui/widgets/button/HyperLink";

export interface CreateSpaceDialogProps {
    type: SpaceType;
    allSpacesStore: AllSpacesStore;
    onClose: () => void;
}

function DialogInner() {
    const store = useCreateSpaceDialogStore();
    return (
        <Dialog onClose={() => store.onClose()}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-none"
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
            placeholder={`Enter ${store.typeLabel.toLowerCase()} name`}
            field={store.nameField}
        />
        <Observer>
            {() =>
                store.type.isCourse ? (
                    <HyperLink onClick={() => store.toggleAdditionalFields()}>
                        <button>{store.showAdditionalFields ? "Hide additional fields" : "Show additional fields"}</button>
                    </HyperLink>
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

export function CreateSpaceDialogProvider({
    children,
    store
}: {
    children: ReactNode;
    store: CreateSpaceDialogStore;
}) {
    return (
        <CreateSpaceDialogContext.Provider value={store}>
            {children}
        </CreateSpaceDialogContext.Provider>
    );
}


export function CreateSpaceDialog(props: CreateSpaceDialogProps) {
    const storeRef = useRef<CreateSpaceDialogStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new CreateSpaceDialogStore({
            type: props.type,
            allSpacesStore: props.allSpacesStore,
            onClose: props.onClose,
        });
    }
    return (
        <CreateSpaceDialogProvider store={storeRef.current}>
            <DialogInner />
        </CreateSpaceDialogProvider>
    );
}