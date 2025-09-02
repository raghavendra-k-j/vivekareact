import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const InputVariants = cva("finput", {
    variants: {
        inputSize: {
            sm: "finput--sm",
            md: "finput--md",
        },
    },
    defaultVariants: {
        inputSize: "md",
    },
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof InputVariants> { }


const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, inputSize, type = "text", ...props }, ref) => {
        return (
            <input
                type={type}
                className={clsx(InputVariants({ inputSize }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };