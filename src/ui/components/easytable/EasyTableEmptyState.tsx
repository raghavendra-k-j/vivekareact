import React from "react";
import clsx from "clsx";

export interface EasyTableEmptyStateProps {
    icon?: React.ReactNode;
    message: string;
    description?: string;
    className?: string;
}

export function EasyTableEmptyState({ icon, message, description, className }: EasyTableEmptyStateProps) {
    return (
        <div className={clsx("flex flex-col items-center gap-2 py-8", className)}>
            {icon && (
                <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    {icon}
                </div>
            )}
            <div className="text-center">
                <p className="text-default font-medium">{message}</p>
                {description && (
                    <p className="text-secondary text-sm mt-0.5">{description}</p>
                )}
            </div>
        </div>
    );
}