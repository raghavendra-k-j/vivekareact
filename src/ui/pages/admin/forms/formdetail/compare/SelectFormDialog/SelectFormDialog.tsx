import { useEffect, useRef } from "react";
import { SelectFormDialogContext, SelectFormDialogStore, useSelectFormDialogStore } from "./SelectFormDialogStore";
import { AdminFormCompareStore } from "../ComparePageStore";
import { FramedDialog } from "~/ui/widgets/dialogmanager";
import { DialogCloseButton, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { FormListView } from "./FormList";
import { SearchInput } from "~/ui/widgets/search/SearchInput";

function SelectFormDialogStoreProvider({ children, parentStore, onClose }: { children: React.ReactNode, parentStore: AdminFormCompareStore, onClose: () => void }) {
    const storeRef = useRef<SelectFormDialogStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = new SelectFormDialogStore({
            parentStore: parentStore,
            onClose: onClose,
        });
    }

    return (
        <SelectFormDialogContext.Provider value={storeRef.current}>
            {children}
        </SelectFormDialogContext.Provider>
    );
}


export type SelectFormDialogProps = {
    parentStore: AdminFormCompareStore;
    onClose: () => void;
}

export default function SelectFormDialog(props: SelectFormDialogProps) {
    return (
        <SelectFormDialogStoreProvider parentStore={props.parentStore} onClose={props.onClose}>
            <DialogInner />
        </SelectFormDialogStoreProvider>
    );
}

function DialogInner() {
    const store = useSelectFormDialogStore();

    useEffect(() => {
        store.loadData();
    }, [store]);

    return (<FramedDialog
        onClose={() => store.onClose()}
        scaffoldClassName="p-6"
        contentClassName="w-full max-w-xl h-full overflow-y-hidden max-h-[600px] flex flex-col">
        <div>
            <DialogHeader
                title="Select Assessment"
                onClose={<DialogCloseButton onClick={() => store.onClose()} />}
            />
            <div className="p-3 border-b border-default">
                <SearchInput inputSize="sm" placeholder="Search assessments" onChange={(e) => store.onSearchQueryChange(e.target.value)} />
            </div>
        </div>
        <FormListView />
    </FramedDialog>);
}