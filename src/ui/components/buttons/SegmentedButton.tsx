import * as React from "react";
import clsx from "clsx";
import { motion, LayoutGroup, useReducedMotion } from "framer-motion";

type Size = "sm" | "md" | "lg";

export type SegmentedOption = { value: string; label: React.ReactNode; disabled?: boolean };

export type SegmentedButtonProps = {
    options: SegmentedOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (val: string) => void;
    size?: Size;
    fullWidth?: boolean;
    className?: string;
    "aria-label"?: string;
};

const sizeCls: Record<Size, string> = {
    sm: "px-2.5 py-1.5 text-[13px]",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-base",
};

/** Wrapper: always surface background, no transparency */
const wrapBase =
    "inline-flex gap-1 rounded-medium border p-1 bg-surface border-default";

const btnBase =
    "relative inline-flex items-center justify-center rounded-md select-none outline-none transition " +
    "focus-visible:ring-2 focus-visible:ring-focus/80 disabled:opacity-50 disabled:pointer-events-none";

/** Primary-only styling; hover uses surface token (no alpha overlays) */
const txtIdle = "text-default hover:bg-content2";
const txtActive = "text-primary-foreground";
const pillBg = "bg-primary";

const spring = { type: "spring" as const, stiffness: 500, damping: 40, mass: 0.6 };

export function SegmentedButton({
    options,
    value,
    defaultValue,
    onChange,
    size = "md",
    fullWidth = false,
    className,
    "aria-label": ariaLabel = "segmented control",
}: SegmentedButtonProps) {
    const first = options.find((o) => !o.disabled)?.value ?? options[0]?.value;
    const isCtrl = value !== undefined;
    const [inner, setInner] = React.useState(defaultValue ?? first);
    const current = isCtrl ? (value as string) : inner;

    const setCurrent = (v: string) => {
        if (!isCtrl) setInner(v);
        onChange?.(v);
    };

    const prefersReduced = useReducedMotion();

    return (
        <LayoutGroup>
            <div
                role="radiogroup"
                aria-label={ariaLabel}
                className={clsx(wrapBase, fullWidth && "w-full justify-center", className)}
            >
                {options.map((opt) => {
                    const selected = current === opt.value && !opt.disabled;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            aria-disabled={opt.disabled || undefined}
                            disabled={opt.disabled}
                            onClick={() => !opt.disabled && setCurrent(opt.value)}
                            className={clsx(btnBase, sizeCls[size], selected ? txtActive : txtIdle)}
                        >
                            {selected && (
                                <motion.span
                                    layoutId="seg-pill"
                                    className={clsx("absolute inset-0 rounded-md", pillBg)}
                                    transition={prefersReduced ? { duration: 0 } : spring}
                                    aria-hidden="true"
                                />
                            )}
                            <span className="relative z-10">{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </LayoutGroup>
    );
}

export default SegmentedButton;
