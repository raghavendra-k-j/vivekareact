import { ReactNode } from "react";
import { Button } from "~/ui/widgets/button/Button";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogScaffold
} from "~/ui/widgets/dialogmanager";

export type BasicErrorDialogButton =
    | ReactNode
    | {
        text: string;
        onClick: () => void;
    };

export interface BasicErrorDialogProps {
    message?: string | ReactNode;
    description?: string | ReactNode;
    primaryButton?: BasicErrorDialogButton;
    secondaryButton?: BasicErrorDialogButton;
}

export function BasicErrorDialog(props: BasicErrorDialogProps) {
    if (!props.message && !props.description) {
        console.warn("BasicErrorDialog requires at least a message or a description.");
        return null;
    }

    const renderButton = (button: BasicErrorDialogButton, isPrimary: boolean) => {
        if (button == null) return null;

        if (typeof button === "object" && "text" in button && "onClick" in button) {
            return isPrimary ? (
                <Button onClick={button.onClick}>{button.text}</Button>
            ) : (
                <Button variant="outline" color="secondary" onClick={button.onClick}>{button.text}</Button>
            );
        }

        return button;
    };

    return (
        <Dialog>
            <DialogOverlay />
            <DialogScaffold className="p-4">
                <DialogContent className="p-4 sm:p-6 w-full max-w-sm">
                    {props.message && (
                        <div className="text-default font-medium text-base">
                            {typeof props.message === "string" ? <span>{props.message}</span> : props.message}
                        </div>
                    )}
                    {props.description && (
                        <div className="mt-2 text-secondary text-sm">
                            {typeof props.description === "string" ? <span>{props.description}</span> : props.description}
                        </div>
                    )}
                    {(props.primaryButton || props.secondaryButton) && (
                        <div className="mt-4 sm:mt-6 flex justify-end gap-2">
                            {props.secondaryButton && renderButton(props.secondaryButton, false)}
                            {props.primaryButton && renderButton(props.primaryButton, true)}
                        </div>
                    )}
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}


