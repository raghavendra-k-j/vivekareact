import { Observer } from "mobx-react-lite";
import React from "react";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { InputError } from "./InputError";
import { InputGroup } from "./InputGroup";
import { InputSize } from "./InputSize";
import { InputValue } from "./InputValue";
import { ReqMark } from "./ReqMark";

export class MobileFieldValue {
    callingCode: string | null;
    mobileNumber: string | null;

    constructor(callingCode: string | null, mobileNumber: string | null) {
        this.callingCode = callingCode;
        this.mobileNumber = mobileNumber;
    }
}

export type CallingCodeOption = {
    code: string;
    label: string;
};

type MobileFieldProps = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    label?: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    field: InputValue<MobileFieldValue>;
    inputSize?: InputSize;
    maxLength?: number;
    callingCodes: CallingCodeOption[];
};

export function MobileField({
    id,
    label,
    required = false,
    placeholder,
    field,
    inputSize = "md",
    maxLength,
    callingCodes,
    ...divProps
}: MobileFieldProps) {
    return (
        <div className="flex flex-col gap-1" {...divProps}>
            {label && (
                <InputLabel inputSize={inputSize} htmlFor={id}>
                    {label} {required && <ReqMark />}
                </InputLabel>
            )}

            <Observer>
                {() => (
                    <InputGroup>
                        <InputGroup.Select
                            autoComplete="section-phone tel-country-code"
                            className="w-auto shrink-0"
                            value={field.value.callingCode ?? ""}
                            onChange={(e) => {
                                const code = e.target.value || null;
                                field.set(new MobileFieldValue(code, field.value.mobileNumber));
                            }}
                        >
                            <option value=""></option>
                            {callingCodes.map((opt) => (
                                <option key={opt.code} value={opt.code}>
                                    {opt.label}
                                </option>
                            ))}
                        </InputGroup.Select>
                        <InputGroup.Input
                            className="flex-1"
                            id={id}
                            type="tel"
                            autoComplete="section-phone tel-national"
                            maxLength={maxLength}
                            placeholder={placeholder}
                            value={field.value.mobileNumber ?? ""}
                            onChange={(e) =>
                                field.set(
                                    new MobileFieldValue(field.value.callingCode, e.target.value)
                                )
                            }
                        />
                    </InputGroup>
                )}
            </Observer>

            <Observer>
                {() => (field.error ? <InputError>{field.error}</InputError> : null)}
            </Observer>
        </div>
    );
}
