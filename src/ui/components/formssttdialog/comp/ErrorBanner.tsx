import { CircleAlert } from "lucide-react";
import clsx from "clsx";

export type ErrorBannerProps = {
    message: string | null;
    description: string | null;
    onRetry: () => void;
    onCancel: () => void;
}

export function ErrorBanner({ message, description, onRetry, onCancel }: ErrorBannerProps) {
    if (!message && !description) {
        throw new Error("ErrorBanner: Either 'message' or 'description' must be provided.");
    }
    return (
        <div
            className={clsx(
                "w-full bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm my-2",
                "flex flex-col gap-1"
            )}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-center gap-2 font-medium">
                <CircleAlert size={18} />
                {message && <span>{message}</span>}
            </div>
            {description && (
                <div className="ml-7 text-xs text-red-600 whitespace-pre-line">{description}</div>
            )}
            <div className="flex gap-4 justify-start">
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-600 font-medium"
                    aria-label="Cancel"
                    type="button"
                >
                    Cancel
                </button>
                <button
                    onClick={onRetry}
                    className="text-red-700 hover:text-red-800 font-semibold"
                    aria-label="Retry"
                    type="button"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}
