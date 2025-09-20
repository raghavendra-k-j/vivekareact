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
    // New styling options
    bgColor?: string;
    hoverBgColor?: string;
    activeBgColor?: string;
    iconColor?: string;
    hoverIconColor?: string;
    activeIconColor?: string;
    bgOpacity?: number; // 0-100
    hoverBgOpacity?: number;
    activeBgOpacity?: number;
    // CSS custom properties for dynamic colors
    customBgColor?: string;
    customIconColor?: string;
    customHoverBgColor?: string;
    customHoverIconColor?: string;
    customActiveBgColor?: string;
    customActiveIconColor?: string;
};

export default function AppBarIconButton({
    badgeText,
    onClick,
    label,
    className = "",
    sizeClass = "w-9 h-9",
    disabled,
    icon,
    // New props with defaults
    bgColor = "white",
    hoverBgColor = "white",
    activeBgColor = "white",
    iconColor,
    hoverIconColor,
    activeIconColor,
    bgOpacity = 10, // Default 10% opacity
    hoverBgOpacity = 20,
    activeBgOpacity = 30,
    // Custom color props
    customBgColor,
    customIconColor,
    customHoverBgColor,
    customHoverIconColor,
    customActiveBgColor,
    customActiveIconColor,
}: AppBarIconButtonProps) {
    // Build dynamic background classes
    const bgClass = customBgColor ? "" : `bg-${bgColor}/${bgOpacity}`;
    const hoverBgClass = customHoverBgColor ? "" : `hover:bg-${hoverBgColor}/${hoverBgOpacity}`;
    const activeBgClass = customActiveBgColor ? "" : `active:bg-${activeBgColor}/${activeBgOpacity}`;

    // Build dynamic text color classes
    const textClass = customIconColor ? "" : (iconColor ? `text-${iconColor}` : "");
    const hoverTextClass = customHoverIconColor ? "" : (hoverIconColor ? `hover:text-${hoverIconColor}` : "");
    const activeTextClass = customActiveIconColor ? "" : (activeIconColor ? `active:text-${activeIconColor}` : "");

    // Build custom styles for dynamic colors
    const customStyles: React.CSSProperties = {};
    if (customBgColor) {
        customStyles.backgroundColor = customBgColor;
        customStyles.opacity = bgOpacity / 100;
    }
    if (customIconColor) customStyles.color = customIconColor;

    // For hover and active states, we'll use CSS classes with custom properties
    const hoverStyles = customHoverBgColor || customHoverIconColor ? {
        '--hover-bg': customHoverBgColor || 'transparent',
        '--hover-color': customHoverIconColor || 'inherit',
        '--hover-opacity': hoverBgOpacity / 100,
    } as React.CSSProperties : {};

    const activeStyles = customActiveBgColor || customActiveIconColor ? {
        '--active-bg': customActiveBgColor || 'transparent',
        '--active-color': customActiveIconColor || 'inherit',
        '--active-opacity': activeBgOpacity / 100,
    } as React.CSSProperties : {};

    const allCustomStyles = { ...customStyles, ...hoverStyles, ...activeStyles };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            style={Object.keys(allCustomStyles).length > 0 ? allCustomStyles : undefined}
            className={clsx(
                "relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                bgClass,
                hoverBgClass,
                activeBgClass,
                textClass,
                hoverTextClass,
                activeTextClass,
                sizeClass,
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                // Add custom hover/active styles if using custom colors
                customHoverBgColor ? "hover:bg-[var(--hover-bg)] hover:opacity-[var(--hover-opacity)]" : "",
                customHoverIconColor ? "hover:text-[var(--hover-color)]" : "",
                customActiveBgColor ? "active:bg-[var(--active-bg)] active:opacity-[var(--active-opacity)]" : "",
                customActiveIconColor ? "active:text-[var(--active-color)]" : "",
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