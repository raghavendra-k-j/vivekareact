import clsx from "clsx";
import { X } from "lucide-react";
import React, { ReactNode } from "react";

export type DialogHeaderProps = {
    className?: string;
    leading?: React.ReactNode | string;
    title?: string | React.ReactNode;
    px?: string | number;
    py?: string | number;
    display?: string;
    border?: string;
    align?: string;
    justify?: string;
    onClose?: ReactNode;
    shadow?: string;
};

export function DialogHeader(props: DialogHeaderProps) {
    const {
        className,
        leading,
        title,
        px = "px-4",
        py = "py-2",
        display = "flex",
        border = "border-b border-default",
        align = "items-center",
        justify = "justify-between",
        shadow = "shadow-none",
        onClose
    } = props;


    // Compose display, border, align, justify
    const displayClass = display;
    const borderClass = border;
    const alignClass = align;
    const justifyClass = justify;
    const shadowClass = shadow;

    return (
        <div
            className={clsx(
                px,
                py,
                borderClass,
                shadowClass,
                displayClass,
                alignClass,
                justifyClass,
                className
            )}
        >
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {leading}
                {typeof title === "string" ? <DefaultDialogTitle title={title} /> : title}
            </div>
            {onClose && onClose}
        </div>
    );
}

export function DefaultDialogTitle({ title }: { title: string }) {
    return (
        <h2 className="text-default font-bold text-base-p truncate" title={title}>
            {title}
        </h2>
    );
}

export function DialogCloseButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            aria-label="Close dialog"
            className="text-default"
            onClick={onClick}
            tabIndex={0}
        >
            <X className="w-6 h-6" />
        </button>
    );
}


type DialogFooterProps = {
    className?: string;
    actions?: ReactNode;
    actionsGap?: string,
    start?: ReactNode;
    px?: string | number;
    py?: string | number;
    display?: string;
    align?: string;
    justify?: string;
}

type DialogCustomFooterProps = {
    className?: string;
    start?: ReactNode;
    end?: ReactNode;
    gap?: string,
    px?: string | number;
    py?: string | number;
    display?: string;
    align?: string;
    justify?: string;
}



export function SelectAllCheckbox({ value, onChange }: { value: boolean, onChange: (checked: boolean) => void }) {
    return (<div className="flex items-center gap-2 cursor-pointer" onClick={() => onChange(!value)}>
        <input
            checked={value}
            onChange={e => onChange(e.target.checked)}
            type="checkbox"
            className="w-4 h-4 pointer-events-none"
        />
        <span className="text-sm text-default select-none">Select All</span>
    </div>);
}


export function DialogCustomFooter(props: DialogCustomFooterProps) {
    const {
        className,
        start,
        end,
        gap = "gap-2",
        px = "px-4",
        py = "py-2",
        display = "flex",
        align = "items-center",
        justify = "justify-between"
    } = props;

    return (
        <div
            className={clsx(
                px,
                py,
                gap,
                display,
                align,
                justify,
                className
            )}
        >
            {start}
            {end}
        </div>
    );
}



export function DialogFooter(props: DialogFooterProps) {
    const {
        className,
        actions,
        actionsGap = "gap-2",
        px = "px-4",
        py = "py-2",
        display = "flex",
        align = "items-center",
        justify = "justify-end"
    } = props;

    return (
        <div
            className={clsx(
                px,
                py,
                actionsGap,
                display,
                align,
                justify,
                className
            )}
        >
            {actions}
        </div>
    );
}