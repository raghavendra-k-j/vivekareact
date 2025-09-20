import { Button } from "../button/Button";

export type ToastViewProps = {
    message?: string | null;
    description?: string | null;
    primaryButton?: {
        text: string;
        onClick: () => void;
    };
    secondaryButton?: {
        text: string;
        onClick: () => void;
    };
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

export function ToastView({
    message,
    description,
    primaryButton,
    secondaryButton,
}: ToastViewProps) {
    return (
        <div className="flex flex-col">
            {message && <div className="text-base-m text-default font-semibold">{message}</div>}
            {description && <div className="text-sm text-secondary">{description}</div>}
            {(primaryButton || secondaryButton) && (
                <div className="mt-2 flex gap-3">
                    {secondaryButton && (
                        <Button variant="outline" color="secondary" size="sm" onClick={secondaryButton.onClick} type="button">
                            {secondaryButton.text}
                        </Button>
                    )}
                    {primaryButton && (
                        <Button
                            size="sm"
                            onClick={primaryButton.onClick}
                            type="button"
                        >
                            {primaryButton.text}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}


