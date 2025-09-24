import { DialogCloseButton, DialogHeader } from "./DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import { Dialog, DialogContent, DialogOverlay, DialogScaffold } from "~/ui/widgets/dialogmanager";

export interface DeleteConfirmationDialogProps {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmationDialog({
    title = "Confirm Delete",
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: DeleteConfirmationDialogProps) {
    return (
        <Dialog onClose={onCancel}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-none"
                        title={title}
                        onClose={<DialogCloseButton onClick={onCancel} />}
                    />
                    <div className="p-6">
                        <p className="text-sm text-gray-700">{message}</p>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t border-default">
                        <Button
                            variant="outline"
                            color="secondary"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            color="danger"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}