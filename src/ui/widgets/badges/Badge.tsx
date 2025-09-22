import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const badgeStyles = cva(
    "inline-flex items-center font-medium whitespace-nowrap",
    {
        variants: {
            variant: {
                solid: "",
                soft: "",
                outline: "border",
            },
            color: {
                primary: "",
                secondary: "",
                danger: "",
                success: "",
                info: "",
                warning: "",
                neutral: "",
                // Extended tailwind palette
                slate: "",
                gray: "",
                zinc: "",
                neutralAlt: "",
                stone: "",
                red: "",
                orange: "",
                amber: "",
                yellow: "",
                lime: "",
                green: "",
                emerald: "",
                teal: "",
                cyan: "",
                sky: "",
                blue: "",
                indigo: "",
                violet: "",
                purple: "",
                fuchsia: "",
                pink: "",
                rose: "",
            },
            size: {
                xs: "text-xs px-2 py-0.5",
                sm: "text-sm-m px-2 py-0.5",
                md: "text-sm px-2.5 py-1",
                lg: "text-base px-3 py-1.5",
            },
            rounded: {
                default: "rounded",
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                full: "rounded-full",
            },
        },
        compoundVariants: [
            // --- Solid ---
            { variant: "solid", color: "primary", className: "bg-primary text-white" },
            { variant: "solid", color: "secondary", className: "bg-slate-600 text-white" },
            { variant: "solid", color: "danger", className: "bg-red-600 text-white" },
            { variant: "solid", color: "success", className: "bg-emerald-600 text-white" },
            { variant: "solid", color: "info", className: "bg-blue-600 text-white" },
            { variant: "solid", color: "warning", className: "bg-yellow-500 text-white" },
            { variant: "solid", color: "neutral", className: "bg-gray-500 text-white" },
            // --- SOLID EXTENDED COLORS ---
            { variant: "solid", color: "slate", className: "bg-slate-600 text-white" },
            { variant: "solid", color: "gray", className: "bg-gray-600 text-white" },
            { variant: "solid", color: "zinc", className: "bg-zinc-600 text-white" },
            { variant: "solid", color: "neutralAlt", className: "bg-neutral-600 text-white" },
            { variant: "solid", color: "stone", className: "bg-stone-600 text-white" },
            { variant: "solid", color: "red", className: "bg-red-600 text-white" },
            { variant: "solid", color: "orange", className: "bg-orange-600 text-white" },
            { variant: "solid", color: "amber", className: "bg-amber-500 text-white" },
            { variant: "solid", color: "yellow", className: "bg-yellow-400 text-white" },
            { variant: "solid", color: "lime", className: "bg-lime-500 text-white" },
            { variant: "solid", color: "green", className: "bg-green-600 text-white" },
            { variant: "solid", color: "emerald", className: "bg-emerald-600 text-white" },
            { variant: "solid", color: "teal", className: "bg-teal-600 text-white" },
            { variant: "solid", color: "cyan", className: "bg-cyan-600 text-white" },
            { variant: "solid", color: "sky", className: "bg-sky-600 text-white" },
            { variant: "solid", color: "blue", className: "bg-blue-600 text-white" },
            { variant: "solid", color: "indigo", className: "bg-indigo-600 text-white" },
            { variant: "solid", color: "violet", className: "bg-violet-600 text-white" },
            { variant: "solid", color: "purple", className: "bg-purple-600 text-white" },
            { variant: "solid", color: "fuchsia", className: "bg-fuchsia-600 text-white" },
            { variant: "solid", color: "pink", className: "bg-pink-600 text-white" },
            { variant: "solid", color: "rose", className: "bg-rose-600 text-white" },

            // --- Soft ---
            { variant: "soft", color: "primary", className: "bg-primary/10 text-primary" },
            { variant: "soft", color: "secondary", className: "bg-slate-100 text-slate-700" },
            { variant: "soft", color: "danger", className: "bg-red-100/50 text-red-700" },
            { variant: "soft", color: "success", className: "bg-emerald-100/50 text-emerald-700" },
            { variant: "soft", color: "info", className: "bg-blue-100 text-blue-700" },
            { variant: "soft", color: "warning", className: "bg-yellow-100 text-yellow-800" },
            { variant: "soft", color: "neutral", className: "bg-gray-100 text-gray-600" },
            // --- SOFT EXTENDED COLORS ---
            { variant: "soft", color: "slate", className: "bg-slate-100 text-slate-700" },
            { variant: "soft", color: "gray", className: "bg-gray-100 text-gray-700" },
            { variant: "soft", color: "zinc", className: "bg-zinc-100 text-zinc-700" },
            { variant: "soft", color: "neutralAlt", className: "bg-neutral-100 text-neutral-700" },
            { variant: "soft", color: "stone", className: "bg-stone-100 text-stone-700" },
            { variant: "soft", color: "red", className: "bg-red-100 text-red-700" },
            { variant: "soft", color: "orange", className: "bg-orange-100 text-orange-700" },
            { variant: "soft", color: "amber", className: "bg-amber-100 text-amber-700" },
            { variant: "soft", color: "yellow", className: "bg-yellow-100 text-yellow-800" },
            { variant: "soft", color: "lime", className: "bg-lime-100 text-lime-700" },
            { variant: "soft", color: "green", className: "bg-green-100 text-green-700" },
            { variant: "soft", color: "emerald", className: "bg-emerald-100 text-emerald-700" },
            { variant: "soft", color: "teal", className: "bg-teal-100 text-teal-700" },
            { variant: "soft", color: "cyan", className: "bg-cyan-100 text-cyan-700" },
            { variant: "soft", color: "sky", className: "bg-sky-100 text-sky-700" },
            { variant: "soft", color: "blue", className: "bg-blue-100 text-blue-700" },
            { variant: "soft", color: "indigo", className: "bg-indigo-100/50 text-indigo-700" },
            { variant: "soft", color: "violet", className: "bg-violet-100 text-violet-700" },
            { variant: "soft", color: "purple", className: "bg-purple-100 text-purple-700" },
            { variant: "soft", color: "fuchsia", className: "bg-fuchsia-100 text-fuchsia-700" },
            { variant: "soft", color: "pink", className: "bg-pink-100 text-pink-700" },
            { variant: "soft", color: "rose", className: "bg-rose-100 text-rose-700" },

            // --- Outline ---
            { variant: "outline", color: "primary", className: "border-primary text-primary" },
            { variant: "outline", color: "secondary", className: "border-slate-400 text-slate-700" },
            { variant: "outline", color: "danger", className: "border-red-400 text-red-700" },
            { variant: "outline", color: "success", className: "border-emerald-400 text-emerald-700" },
            { variant: "outline", color: "info", className: "border-blue-400 text-blue-700" },
            { variant: "outline", color: "warning", className: "border-yellow-500 text-yellow-800" },
            { variant: "outline", color: "neutral", className: "border-gray-400 text-gray-600" },
            // --- OUTLINE EXTENDED COLORS ---
            { variant: "outline", color: "slate", className: "border-slate-300 text-slate-700" },
            { variant: "outline", color: "gray", className: "border-gray-300 text-gray-700" },
            { variant: "outline", color: "zinc", className: "border-zinc-300 text-zinc-700" },
            { variant: "outline", color: "neutralAlt", className: "border-neutral-300 text-neutral-700" },
            { variant: "outline", color: "stone", className: "border-stone-300 text-stone-700" },
            { variant: "outline", color: "red", className: "border-red-300 text-red-700" },
            { variant: "outline", color: "orange", className: "border-orange-300 text-orange-700" },
            { variant: "outline", color: "amber", className: "border-amber-300 text-amber-700" },
            { variant: "outline", color: "yellow", className: "border-yellow-300 text-yellow-800" },
            { variant: "outline", color: "lime", className: "border-lime-300 text-lime-700" },
            { variant: "outline", color: "green", className: "border-green-300 text-green-700" },
            { variant: "outline", color: "emerald", className: "border-emerald-300 text-emerald-700" },
            { variant: "outline", color: "teal", className: "border-teal-300 text-teal-700" },
            { variant: "outline", color: "cyan", className: "border-cyan-300 text-cyan-700" },
            { variant: "outline", color: "sky", className: "border-sky-300 text-sky-700" },
            { variant: "outline", color: "blue", className: "border-blue-300 text-blue-700" },
            { variant: "outline", color: "indigo", className: "border-indigo-300 text-indigo-700" },
            { variant: "outline", color: "violet", className: "border-violet-300 text-violet-700" },
            { variant: "outline", color: "purple", className: "border-purple-300 text-purple-700" },
            { variant: "outline", color: "fuchsia", className: "border-fuchsia-300 text-fuchsia-700" },
            { variant: "outline", color: "pink", className: "border-pink-300 text-pink-700" },
            { variant: "outline", color: "rose", className: "border-rose-300 text-rose-700" },
        ],
        defaultVariants: {
            variant: "soft",
            color: "neutral",
            size: "sm",
            rounded: "sm",
        },
    }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof badgeStyles> & {
        icon?: React.ReactNode;
    };

export type BadgeSize = "sm" | "md" | "lg" | "xs";


export const Badge = ({ className, icon, children, ...props }: BadgeProps) => {
    return (
        <span className={clsx(badgeStyles(props), className)}>
            {icon && <span className="mr-1 inline-block">{icon}</span>}
            {children}
        </span>
    );
};
