import { Observer } from "mobx-react-lite";
import React from "react";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { InputError } from "./InputError";
import { ReqMark } from "./ReqMark";
import { InputValue } from "./InputValue";
import { InputSize } from "./InputSize";
import { Input } from "./Input";

type FTextFieldProps = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    label?: React.ReactNode;
    required?: boolean;
    type?: string;
    placeholder?: string;
    field: InputValue<string>;
    inputSize?: InputSize;
    maxLength?: number;
};

export function FTextField({
    id,
    label,
    required = false,
    type = "text",
    placeholder,
    field,
    inputSize = "md",
    maxLength,
    ...divProps
}: FTextFieldProps) {
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
                {() => (
                    <Input
                        id={id}
                        type={type}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        value={field.value}
                        inputSize={inputSize}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                )}
            </Observer>

            <Observer>
                {() => (field.error ? <InputError>{field.error}</InputError> : null)}
            </Observer>
        </div>
    );
}
