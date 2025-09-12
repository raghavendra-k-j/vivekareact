import * as React from "react";
import clsx from "clsx";

export type AppBarIconButtonProps = {
    badgeText?: string;
    onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
    label?: string;
    className?: string;
    sizeClass?: string;
    iconSize?: number;
    disabled?: boolean;
    icon: React.ReactNode;
};

export default function AppBarIconButton({
    badgeText,
    onClick,
    label,
    className = "",
    sizeClass = "w-9 h-9",
    disabled,
    icon,
}: AppBarIconButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={clsx(
                "relative inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-default transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                sizeClass,
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                className
            )}
        >
            {icon}
            {badgeText && (
                <span
                    className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] leading-5 text-center font-semibold shadow ring-1 ring-white/60"
                >
                    {badgeText}
                </span>
            )}
        </button>
    );
}