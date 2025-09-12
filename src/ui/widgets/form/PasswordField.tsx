import { Eye, EyeOff } from "lucide-react";
import { Observer } from "mobx-react-lite";
import React from "react";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { InputError } from "./InputError";
import { InputGroup } from "./InputGroup";
import { InputSize } from "./InputSize";
import { InputValue } from "./InputValue";
import { ReqMark } from "./ReqMark";

type PasswordFieldProps = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    label?: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    field: InputValue<string>;
    inputSize?: InputSize;
    maxLength?: number;
    passwordVisible: boolean;
    onClickEye: () => void;
};

export function PasswordField({
    id,
    label,
    required = false,
    placeholder,
    field,
    inputSize = "md",
    maxLength,
    passwordVisible,
    onClickEye,
    ...divProps
}: PasswordFieldProps) {
    const handleChange = (newVal: string) => {
        field.set(newVal);
    };

    let Icon = Eye;
    if (passwordVisible) {
        Icon = EyeOff;
    }

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
                        <InputGroup.Input
                            className="flex-1"
                            id={id}
                            type={passwordVisible ? "text" : "password"}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            value={field.value}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                        <InputGroup.IconButton aria-label="toggle-password-visibility" onClick={onClickEye}>
                            <Icon className="w-4 h-4" />
                        </InputGroup.IconButton>
                    </InputGroup>
                )}
            </Observer>


            <Observer>
                {() => (field.error ? <InputError>{field.error}</InputError> : null)}
            </Observer>
        </div>
    );
}
