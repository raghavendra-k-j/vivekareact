import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";
import { Loader } from "lucide-react";

/* ----------------------------- Button Styles ----------------------------- */

const buttonStyles = cva(
    "inline-flex items-center justify-center font-medium rounded-[var(--dimen-button-radius)] px-4 py-2 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2",
    {
        variants: {
            size: {
                xs: "text-xs px-2 py-1 h-6",
                sm: "text-sm px-3 py-1.5 h-8",
                md: "text-base px-4 py-2 h-10",
                lg: "text-lg px-5 py-2.5 h-11",
                xl: "text-xl px-6 py-3 h-12",
            },
            variant: {
                solid: "",
                soft: "",
                outline: "border",
                ghost: "bg-transparent border-transparent",
            },
            color: {
                primary: "",
                danger: "",
                secondary: "",
                success: "",
                info: "",
            },
            shadow: {
                none: "shadow-none",
                xs: "shadow-xs",
                sm: "shadow-sm",
                md: "shadow-md",
                lg: "shadow-lg",
                xl: "shadow-xl",
            },

            /** Grouping support **/
            groupPosition: {
                single: "", // not in a group
                first: "",
                middle: "",
                last: "",
            },
            groupOrientation: {
                horizontal: "",
                vertical: "",
            },
            attached: {
                false: "",
                true: "",
            },
            equalWidth: {
                false: "",
                true: "flex-1",
            },
        },

        compoundVariants: [
            // --- SOLID ---
            { variant: "solid", color: "primary", className: "bg-primary text-white hover:bg-primary/90" },
            { variant: "solid", color: "danger", className: "bg-red-600 text-white hover:bg-red-500" },
            { variant: "solid", color: "secondary", className: "bg-slate-600 text-white hover:bg-slate-500" },
            { variant: "solid", color: "success", className: "bg-emerald-600 text-white hover:bg-emerald-500" },
            { variant: "solid", color: "info", className: "bg-blue-600 text-white hover:bg-blue-500" },

            // --- SOFT ---
            { variant: "soft", color: "primary", className: "bg-primary/10 text-primary hover:bg-primary/20" },
            { variant: "soft", color: "danger", className: "bg-red-100 text-red-600 hover:bg-red-200" },
            { variant: "soft", color: "secondary", className: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
            { variant: "soft", color: "success", className: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" },
            { variant: "soft", color: "info", className: "bg-blue-100 text-blue-600 hover:bg-blue-200" },

            // --- OUTLINE ---
            { variant: "outline", color: "primary", className: "text-primary border-primary-300 hover:bg-primary/10" },
            { variant: "outline", color: "danger", className: "text-red-600 border-red-300 hover:bg-red-100" },
            { variant: "outline", color: "secondary", className: "text-slate-600 border-slate-300 hover:bg-slate-100" },
            { variant: "outline", color: "success", className: "text-emerald-600 border-emerald-300 hover:bg-emerald-100" },
            { variant: "outline", color: "info", className: "text-blue-600 border-blue-300 hover:bg-blue-100" },

            // --- GHOST ---
            { variant: "ghost", color: "primary", className: "text-primary hover:bg-primary/10" },
            { variant: "ghost", color: "danger", className: "text-red-600 hover:bg-red-100" },
            { variant: "ghost", color: "secondary", className: "text-slate-600 hover:bg-slate-100" },
            { variant: "ghost", color: "success", className: "text-emerald-600 hover:bg-emerald-100" },
            { variant: "ghost", color: "info", className: "text-blue-600 hover:bg-blue-100" },

            // --- Grouped radii (horizontal) ---
            { groupOrientation: "horizontal", groupPosition: "first", className: "rounded-r-none" },
            { groupOrientation: "horizontal", groupPosition: "middle", className: "rounded-none" },
            { groupOrientation: "horizontal", groupPosition: "last", className: "rounded-l-none" },

            // --- Grouped radii (vertical) ---
            { groupOrientation: "vertical", groupPosition: "first", className: "rounded-b-none" },
            { groupOrientation: "vertical", groupPosition: "middle", className: "rounded-none" },
            { groupOrientation: "vertical", groupPosition: "last", className: "rounded-t-none" },

            // --- Attached border collapse (horizontal) ---
            { attached: true, groupOrientation: "horizontal", groupPosition: "middle", className: "-ml-px" },
            { attached: true, groupOrientation: "horizontal", groupPosition: "last", className: "-ml-px" },

            // --- Attached border collapse (vertical) ---
            { attached: true, groupOrientation: "vertical", groupPosition: "middle", className: "-mt-px" },
            { attached: true, groupOrientation: "vertical", groupPosition: "last", className: "-mt-px" },
        ],

        defaultVariants: {
            size: "md",
            variant: "solid",
            color: "primary",
            shadow: "xs",
            groupPosition: "single",
            groupOrientation: "horizontal",
            attached: false,
            equalWidth: false,
        },
    }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonStyles> & {
        loading?: boolean;
        icon?: React.ReactNode;
        iconRight?: React.ReactNode;
    };

export const Button = ({
    size = "md",
    variant,
    color,
    shadow,
    loading = false,
    disabled = false,
    icon,
    iconRight,
    className,
    children,
    groupPosition,
    groupOrientation,
    attached,
    equalWidth,
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || loading;
    const iconSize = getIconSize(size);

    return (
        <button
            type="button"
            disabled={isDisabled}
            className={clsx(
                buttonStyles({
                    size,
                    variant,
                    color,
                    shadow,
                    groupPosition,
                    groupOrientation,
                    attached,
                    equalWidth,
                }),
                className
            )}
            {...props}
        >
            {loading ? (
                <Loader className="animate-spin" size={iconSize} />
            ) : (
                <>
                    {icon && <span className="flex items-center">{icon}</span>}
                    {children}
                    {iconRight && <span className="flex items-center">{iconRight}</span>}
                </>
            )}
        </button>
    );
};

Button.displayName = "Button";

function getIconSize(size: ButtonProps["size"]) {
    switch (size) {
        case "xs": return 12;
        case "sm": return 14;
        case "md": return 16;
        case "lg": return 18;
        case "xl": return 20;
        default: return 16;
    }
}

/* ----------------------------- Button Group ------------------------------ */

type ButtonGroupProps = {
    children: React.ReactNode;
    orientation?: "horizontal" | "vertical";
    attached?: boolean;   // share borders (segmented)
    equalWidth?: boolean; // make all buttons flex-1
    className?: string;
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
    children,
    orientation = "horizontal",
    attached = false,
    equalWidth = false,
    className,
}) => {
    const items = React.Children.toArray(children).filter(Boolean) as React.ReactElement[];

    return (
        <div
            className={clsx(
                orientation === "horizontal" ? "inline-flex" : "inline-flex flex-col",
                attached ? "" : orientation === "horizontal" ? "gap-2" : "gap-2",
                className
            )}
            role="group"
        >
            {items.map((child, idx) => {
                const pos =
                    items.length === 1
                        ? "single"
                        : idx === 0
                            ? "first"
                            : idx === items.length - 1
                                ? "last"
                                : "middle";

                // Pass group props into Button (or any compatible component using the same API)
                return React.cloneElement(child, {
                    groupPosition: pos,
                    groupOrientation: orientation,
                    attached,
                    equalWidth,
                    // preserve any existing className on child; our Button handles it already
                } as Partial<ButtonProps>);
            })}
        </div>
    );
};
