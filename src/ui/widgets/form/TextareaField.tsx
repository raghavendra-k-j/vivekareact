import React from "react";
import { Observer } from "mobx-react-lite";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { InputValue } from "./InputValue";
import { InputError } from "./InputError";
import { ReqMark } from "./ReqMark";
import { Textarea } from "./Textarea";

type TextareaFieldProps = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    label?: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    rows?: number;
    field: InputValue<string>;
};

export function TextareaField({
    id,
    label,
    required = false,
    placeholder,
    rows = 4,
    field,
    ...divProps
}: TextareaFieldProps) {
    const handleChange = (newVal: string) => {
        field.set(newVal);
    };

    return (
        <div className="flex flex-col gap-1" {...divProps}>
            {label && (
                <InputLabel htmlFor={id}>
                    {label} {required && <ReqMark />}
                </InputLabel>
            )}

            <Observer>
                {() => (
                    <Textarea
                        id={id}
                        placeholder={placeholder}
                        rows={rows}
                        value={field.value}
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