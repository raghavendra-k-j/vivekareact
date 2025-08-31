import clsx from "clsx";
import { ReactNode } from "react";

export type SimpleErrorViewProps = {
    message: ReactNode | string | null | undefined;
    description?: ReactNode | string | null | undefined;
    actions?: ReactNode[] | ReactNode | null | undefined;
    className?: string;
};

export function SimpleErrorView({
    message,
    description,
    actions,
    className = "",
}: SimpleErrorViewProps) {
    if (!message && !description && !actions) return null;

    return (
        <div className={clsx("space-y-4", className)}>
            <div className="space-y-1">
                {message && <div className="font-semibold text-base-p text-default text-center">{message}</div>}
                {description && <div className="text-base-m text-center text-secondary">{description}</div>}
            </div>
            {actions && (
                <div className="flex gap-2 flex-wrap justify-center">
                    {Array.isArray(actions)
                        ? actions.map((action, idx) => <span key={idx}>{action}</span>)
                        : actions}
                </div>
            )}
        </div>
    );
}
