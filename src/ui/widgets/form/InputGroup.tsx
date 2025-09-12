import React, { createContext, useContext } from "react";
import clsx from "clsx";
import { Input, type InputProps } from "./Input";
import { SelectInput, type SelectInputProps } from "./SelectInput";

type InputSize = "sm" | "md";
type GroupPosition = "single" | "first" | "middle" | "last";

type GroupContextValue = {
    inputSize: InputSize;
    attached: boolean;
    disabled?: boolean;
    invalid?: boolean;
};

const InputGroupCtx = createContext<GroupContextValue | null>(null);

const useInputGroup = () => {
    const ctx = useContext(InputGroupCtx);
    if (!ctx) throw new Error("InputGroup subcomponent must be used within <InputGroup />");
    return ctx;
};

export type InputGroupProps = {
    inputSize?: InputSize;
    attached?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    fullWidth?: boolean;
    className?: string;
    children: React.ReactNode;
};

function InputGroupBase({
    inputSize = "md",
    attached = true,
    disabled,
    invalid,
    fullWidth,
    className,
    children,
}: InputGroupProps) {
    const kids = React.Children.toArray(children).filter(Boolean) as React.ReactElement[];

    const enhanced = kids.map((child, idx) => {
        const pos: GroupPosition =
            kids.length === 1 ? "single" : idx === 0 ? "first" : idx === kids.length - 1 ? "last" : "middle";
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<any>, { __igPos: pos });
    });

    return (
        <InputGroupCtx.Provider value={{ inputSize, attached, disabled, invalid }}>
            <div
                role="group"
                className={clsx(
                    "ig inline-flex items-stretch",
                    attached ? "ig--attached" : "ig--spaced",
                    fullWidth && "w-full",
                    className
                )}
            >
                {enhanced}
            </div>
        </InputGroupCtx.Provider>
    );
}

type AddonProps = React.HTMLAttributes<HTMLSpanElement> & { __igPos?: GroupPosition };

function AddonBase({ __igPos = "single", className, children, ...props }: AddonProps) {
    const { inputSize, disabled, invalid } = useInputGroup();
    return (
        <span
            {...props}
            className={clsx(
                "ig-addon",
                inputSize === "sm" ? "ig-addon--sm" : "ig-addon--md",
                __igPos === "first" && "ig-rounded-r-none",
                __igPos === "middle" && "ig-rounded-none ig-cut-l",
                __igPos === "last" && "ig-rounded-l-none ig-cut-l",
                disabled && "is-disabled",
                invalid && "is-invalid",
                className
            )}
        >
            {children}
        </span>
    );
}

type GroupInputProps = Omit<InputProps, "inputSize"> & { __igPos?: GroupPosition };

function GroupInput({ __igPos = "single", className, ...props }: GroupInputProps) {
    const { inputSize, disabled, invalid } = useInputGroup();
    return (
        <Input
            {...props}
            disabled={disabled ?? props.disabled}
            inputSize={inputSize}
            className={clsx(
                __igPos === "first" && "ig-rounded-r-none",
                __igPos === "middle" && "ig-rounded-none ig-cut-l",
                __igPos === "last" && "ig-rounded-l-none ig-cut-l",
                invalid && "is-invalid",
                className
            )}
        />
    );
}

type GroupSelectProps = Omit<SelectInputProps, "inputSize"> & { __igPos?: GroupPosition };

function GroupSelect({ __igPos = "single", className, children, ...props }: GroupSelectProps) {
    const { inputSize, disabled, invalid } = useInputGroup();
    return (
        <SelectInput
            {...props}
            disabled={disabled ?? props.disabled}
            inputSize={inputSize}
            className={clsx(
                __igPos === "first" && "ig-rounded-r-none",
                __igPos === "middle" && "ig-rounded-none ig-cut-l",
                __igPos === "last" && "ig-rounded-l-none ig-cut-l",
                invalid && "is-invalid",
                className
            )}
        >
            {children}
        </SelectInput>
    );
}

type GroupIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    __igPos?: GroupPosition;
    "aria-label": string;
};

function GroupIconButton({ __igPos = "single", className, type, ...props }: GroupIconButtonProps) {
    const { inputSize, disabled, invalid } = useInputGroup();
    return (
        <button
            {...props}
            type={type ?? "button"}
            disabled={disabled ?? props.disabled}
            className={clsx(
                "ig-btn",
                inputSize === "sm" ? "ig-btn--sm" : "ig-btn--md",
                __igPos === "first" && "ig-rounded-r-none",
                __igPos === "middle" && "ig-rounded-none ig-cut-l",
                __igPos === "last" && "ig-rounded-l-none ig-cut-l",
                invalid && "is-invalid",
                className
            )}
        />
    );
}

type InputGroupCompound = React.FC<InputGroupProps> & {
    Input: typeof GroupInput;
    Addon: typeof AddonBase;
    Select: typeof GroupSelect;
    IconButton: typeof GroupIconButton;
};

export const InputGroup = Object.assign(InputGroupBase, {
    Input: GroupInput,
    Addon: AddonBase,
    Select: GroupSelect,
    IconButton: GroupIconButton,
}) as InputGroupCompound;
