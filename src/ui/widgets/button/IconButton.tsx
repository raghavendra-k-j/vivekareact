import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";
import { Loader } from "lucide-react";

const iconButtonStyles = cva(
    "inline-flex shrink-0 items-center justify-center focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            size: {
                xs: "h-6 w-6 text-[12px]",
                sm: "h-8 w-8 text-[14px]",
                md: "h-10 w-10 text-[16px]",
                lg: "h-11 w-11 text-[18px]",
                xl: "h-12 w-12 text-[20px]",
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
            shape: {
                rounded: "rounded-[var(--dimen-button-radius)]",
                square: "rounded-none",
                circle: "rounded-full",
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
        ],
        defaultVariants: {
            size: "md",
            variant: "solid",
            color: "primary",
            shadow: "none",
            shape: "rounded",
        },
    }
);

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof iconButtonStyles> & {
        icon: React.ReactNode;
        loading?: boolean;
        shape?: "rounded" | "square" | "circle";
    };

export const IconButton = ({
    size = "md",
    variant,
    color,
    shadow,
    shape = "rounded",
    icon,
    loading = false,
    disabled = false,
    className,
    ...props
}: IconButtonProps) => {
    const isDisabled = disabled || loading;
    const iconSize = getIconSize(size);

    return (
        <button
            type="button"
            disabled={isDisabled}
            className={clsx(iconButtonStyles({ size, variant, color, shadow, shape }), className)}
            {...props}
        >
            {loading ? <Loader className="animate-spin" size={iconSize} /> : icon}
        </button>
    );
};

function getIconSize(size: IconButtonProps["size"]) {
    switch (size) {
        case "xs": return 12;
        case "sm": return 14;
        case "md": return 16;
        case "lg": return 18;
        case "xl": return 20;
        default: return 16;
    }
}
