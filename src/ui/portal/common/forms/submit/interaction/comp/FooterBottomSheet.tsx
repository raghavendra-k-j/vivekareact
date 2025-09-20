import { Button } from "~/ui/widgets/button/Button";
import { Dialog, DialogBottomSheetScaffold, DialogContent, DialogOverlay } from "~/ui/widgets/dialogmanager";
import { InteractionContext } from "../InteractionContext";
import { InteractionStore } from "../InteractionStore";
import { QuestionVm } from "../models/QuestionVm";
import { FormDetailSection } from "./FormDetailComponent";
import { QIndexPanel } from "./QIndexPanel";



type BottomSheetDialogProps = {
    store: InteractionStore;
    onClickClose: () => void;
    children: React.ReactNode;
};

export function BottomSheetDialog({ store, onClickClose, children }: BottomSheetDialogProps) {
    return (
        <InteractionContext.Provider value={store}>
            <Dialog onClose={onClickClose}>
                <DialogOverlay />
                <DialogBottomSheetScaffold>
                    <DialogContent className="w-full mx-4 pt-3 pb-0 max-h-[80vh] flex flex-col">
                        {/* Scrollable content area */}
                        <div className="overflow-y-auto flex-1 p-4">
                            {children}
                        </div>

                        {/* Fixed button at the bottom */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <Button variant="outline" color="secondary" className="w-full" onClick={onClickClose}>
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </DialogBottomSheetScaffold>
            </Dialog>
        </InteractionContext.Provider>
    );
}



export type QuestionsBottomSheetProps = {
    store: InteractionStore;
    onClickClose: () => void;
    onClickQuestion: (vm: QuestionVm) => void;
};

export function QuestionsBottomSheet(props: QuestionsBottomSheetProps) {
    return (
        <BottomSheetDialog store={props.store} onClickClose={props.onClickClose}>
            <QIndexPanel
                onClickQuestion={async (vm) => {
                    props.onClickQuestion(vm);
                }}
            />
        </BottomSheetDialog>
    );
}


export type FormDetailBottomSheetProps = {
    store: InteractionStore;
    onClickClose: () => void;
};


export function FormDetailBottomSheet(props: FormDetailBottomSheetProps) {
    return (
        <BottomSheetDialog store={props.store} onClickClose={props.onClickClose}>
            <FormDetailSection />
        </BottomSheetDialog>
    );
}
