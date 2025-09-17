import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";

import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogScaffold
} from "~/ui/widgets/dialogmanager";
import { useDialogManager } from "~/ui/widgets/dialogmanager/DialogManagerContext";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { AiCreateSpaceDialogProvider, useAiCreateSpaceDialogStore } from "./AiCreateSpaceDialogContext";
import { AiCreateSpaceDialogStore } from "./AiCreateSpaceDialogStore";
import { AiCreateSpaceInputView } from "./InputView";
import { AiCreateSpaceOutputView } from "./OutputView";

export interface AiCreateSpaceDialogProps {
    parentId: number | null;
    adminSpacesService: AdminSpacesService;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
}

function DialogInner() {
    return (
        <Dialog onClose={() => { }}>
            <DialogOverlay />
            <DialogScaffold className="p-6">
                <DialogContent className="w-full max-w-4xl h-full max-h-[700px]">
                    <MainContent />
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}



function MainContent() {
    const store = useAiCreateSpaceDialogStore();
    return (<Observer>
        {() => {
            if (store.isInputScreen) {
                return (<AiCreateSpaceInputView />);
            }
            else if (store.isOutputScreen) {
                return (<AiCreateSpaceOutputView />);
            }
            return null;
        }}
    </Observer>);
}

export function AiCreateSpaceDialog(props: AiCreateSpaceDialogProps) {
    const storeRef = useRef<AiCreateSpaceDialogStore | null>(null);
    const dialogManager = useDialogManager();
    if (!storeRef.current) {
        storeRef.current = new AiCreateSpaceDialogStore({
            adminSpacesService: props.adminSpacesService,
            parentId: props.parentId,
            layoutStore: props.layoutStore,
            allSpacesStore: props.allSpacesStore,
            dialogManager: dialogManager,
        });
    }
    return (
        <AiCreateSpaceDialogProvider store={storeRef.current}>
            <DialogInner />
        </AiCreateSpaceDialogProvider>
    );
}