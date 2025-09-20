import { FramedDialog } from "~/ui/widgets/dialogmanager";
import { AlarmClockOff } from "lucide-react";
import { InteractionStore } from "../InteractionStore";
import { Button } from "~/ui/widgets/button/Button";

export interface TimesUpDialogProps {
    store: InteractionStore;
    onSubmit: () => void;
    onQuit: () => void;
}

export function TimesUpDialog({ onSubmit, onQuit }: TimesUpDialogProps) {
    return (
        <FramedDialog
            scaffoldClassName="p-4"
            contentClassName="p-4 w-full max-w-sm"
            onClose={() => { }}
        >
            <div className="flex flex-col items-center text-center">
                <AlarmClockOff size={48} className="text-primary mb-4" />
                <h2 className="text-lg font-semibold text-default">
                    Time’s Up
                </h2>
                <p className="text-base text-secondary mt-1">
                    Your time for the assessment has expired. Please submit your answers now.
                </p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" color="secondary" onClick={onQuit}>
                    Cancel
                </Button>
                <Button onClick={onSubmit}>
                    Submit Assessment
                </Button>
            </div>
        </FramedDialog>
    );
}
