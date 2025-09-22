import clsx from "clsx";
import { ReactNode } from "react";

export type AdminPageAppBarProps = {
    start?: ReactNode;
    end?: ReactNode;
    bottom?: ReactNode;
    className?: string;
};

export function AdminPageAppBar({ start, end, bottom, className }: AdminPageAppBarProps) {
    return (
        <header className={clsx("bg-surface shadow w-full z-10", className)}>
            <div className="flex items-center justify-between min-h-14 py-2 px-4 sm:px-6">
                <div className="flex items-center gap-2 min-w-0">{start}</div>
                <div className="flex items-center gap-4">{end}</div>
            </div>
            {bottom && bottom}
        </header>
    );
}

export type AdminPageAppBarTitleProps = {
    title: string;
    className?: string;
};

export function AdminPageAppBarTitle({ title, className }: AdminPageAppBarTitleProps) {
    return (
        <div className={clsx("flex items-center min-w-0", className)}>
            <span className="text-base sm:text-lg font-semibold text-default truncate">{title}</span>
        </div>
    );
}
