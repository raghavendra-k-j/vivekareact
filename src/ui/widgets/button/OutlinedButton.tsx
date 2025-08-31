import clsx from "clsx";
import React from "react";
import { ButtonSize } from "./ButtonSize";

type OutlinedButtonVariant = "neutral";

type OutlinedButtonProps<T extends React.ElementType> = {
    as?: T;
    children: React.ReactNode;
    variant?: OutlinedButtonVariant;
    size?: ButtonSize;
    className?: string;
} & React.ComponentPropsWithoutRef<T>;

export default function OutlinedButton<T extends React.ElementType = "button">({
    as,
    children,
    variant = "neutral",
    size = "md",
    className,
    ...rest
}: OutlinedButtonProps<T>) {
    const classNameComputed = clsx(
        "btn",
        `btn--${size}`,
        "btn-outlined",
        `btn--${variant}`,
        className
    );

    const Component = as || "button";
    return (
        <Component className={classNameComputed} {...rest}>
            {children}
        </Component>
    );
}
