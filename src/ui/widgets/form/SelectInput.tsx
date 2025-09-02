import clsx from "clsx";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const SelectInputVariants = cva(
    "fselect",
    {
        variants: {
            inputSize: {
                sm: "fselect--sm",
                md: "fselect--md",
            },
        },
        defaultVariants: {
            inputSize: "md",
        },
    }
);

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement>, VariantProps<typeof SelectInputVariants> { }

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
    ({ className, inputSize, children, ...props }, ref) => {
        return (
            <select
                className={clsx(SelectInputVariants({ inputSize }), className)}
                ref={ref}
                {...props}
            >
                {children}
            </select>
        );
    }
);

SelectInput.displayName = "SelectInput";

export { SelectInput };
