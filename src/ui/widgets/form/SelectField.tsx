import { Observer } from "mobx-react-lite";
import React from "react";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { InputError } from "./InputError";
import { InputSize } from "./InputSize";
import { InputValue } from "./InputValue";
import { ReqMark } from "./ReqMark";
import { SelectInput } from "./SelectInput";

export type FSelectOption<T = any> = {
    data: T;
    value: (data: T) => string;
    label: (data: T) => string | React.ReactNode;
};

type FSelectFieldProps<T = any> = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    label?: React.ReactNode;
    required?: boolean;
    field: InputValue<string>;
    options: FSelectOption<T>[];
    inputSize?: InputSize;
    placeholder?: string;
};

export function FSelectField<T>({
    id,
    label,
    required = false,
    field,
    options,
    inputSize = "md",
    placeholder,
    ...divProps
}: FSelectFieldProps<T>) {
    const handleChange = (newVal: string) => {
        field.set(newVal);
    };

    return (
        <div className="flex flex-col gap-1" {...divProps}>
            {label && (
                <InputLabel inputSize={inputSize} htmlFor={id}>
                    {label} {required && <ReqMark />}
                </InputLabel>
            )}

            <Observer>
                {() => {
                    return (
                        <SelectInput
                            id={id}
                            value={field.value}
                            onChange={(e) => handleChange(e.target.value)}
                            inputSize={inputSize}
                        >
                            {placeholder && (
                                <option value="" disabled>
                                    {placeholder}
                                </option>
                            )}
                            {options.map(({ data, value, label }) => {
                                const val = value(data);
                                const lbl = label(data);
                                return (
                                    <option key={val} value={val}>
                                        {lbl}
                                    </option>
                                );
                            })}
                        </SelectInput>
                    );
                }}
            </Observer>

            <Observer>
                {() => (field.error ? <InputError>{field.error}</InputError> : null)}
            </Observer>
        </div>
    );
}
