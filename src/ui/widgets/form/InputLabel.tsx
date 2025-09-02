import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const InputLabelVariants = cva("text-default", {
    variants: {
        inputSize: {
            sm: "text-xs",
            md: "text-sm",
        },
    },
    defaultVariants: {
        inputSize: "md",
    },
});

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
    VariantProps<typeof InputLabelVariants>;

export function InputLabel({
    inputSize,
    className,
    children,
    ...props
}: LabelProps) {
    return (
        <label {...props} className={InputLabelVariants({ inputSize: inputSize, className })}>
            {children}
        </label>
    );
}
