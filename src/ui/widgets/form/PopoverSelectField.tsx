import React from "react";
import { Observer } from "mobx-react-lite";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { InputValue } from "./InputValue";
import { InputError } from "./InputError";
import { ReqMark } from "./ReqMark";
import { InputSize } from "./InputSize";
import { PopoverSelect } from "./PopoverSelect";
import clsx from "clsx";

export type PopoverSelectFieldProps<T> = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    label?: React.ReactNode;
    required?: boolean;
    field: InputValue<T | null>;
    items: T[] | ReadonlyArray<T>;
    itemRenderer: (item: T) => React.ReactNode | string;
    itemKey: (item: T) => string | number;
    buttonRenderer?: (item: T) => React.ReactNode | string;
    inputSize?: InputSize;
    placeholder?: string | React.ReactNode;
    disabled?: boolean;
    onValueChange: (value: T | null) => void;
    className?: string;
    hidePlaceholder?: boolean;
};


function PopoverSelectField<T>({
    id,
    label,
    required = false,
    field,
    items,
    itemRenderer,
    itemKey,
    buttonRenderer,
    inputSize = "md",
    placeholder = "Select an option",
    disabled = false,
    onValueChange,
    className = "",
    hidePlaceholder = false,
    ...divProps
}: PopoverSelectFieldProps<T>) {
    const handleChange = (val: T | null) => {
        onValueChange(val);
    };

    return (
        <div className={clsx("flex flex-col gap-1", className)} {...divProps}>
            {label && (
                <InputLabel inputSize={inputSize} htmlFor={id}>
                    {label} {required && <ReqMark />}
                </InputLabel>
            )}

            <Observer>
                {() => (
                    <PopoverSelect
                        items={items}
                        itemRenderer={itemRenderer}
                        itemKey={itemKey}
                        buttonRenderer={buttonRenderer}
                        value={field.value}
                        onValueChange={handleChange}
                        inputSize={inputSize}
                        placeholder={placeholder}
                        disabled={disabled}
                        id={id}
                        hidePlaceholder={hidePlaceholder}
                    />
                )}
            </Observer>

            <Observer>
                {() => (field.error ? <InputError>{field.error}</InputError> : null)}
            </Observer>
        </div>
    );
}


export { PopoverSelectField };