import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const TextareaVariants = cva("input", {
    variants: {
        inputSize: {
            sm: "input--sm",
            md: "input--md",
        },
    },
    defaultVariants: {
        inputSize: "md",
    },
});

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof TextareaVariants> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, inputSize, ...props }, ref) => {
        return (
            <textarea
                className={clsx(TextareaVariants({ inputSize }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";
export { Textarea };
