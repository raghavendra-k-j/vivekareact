import type { ReactNode } from "react";

export type CheckboxInputProps = {
    value: boolean;
    id?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
};

export const CheckboxInput = ({ value, id, className = '', disabled, onChange }: CheckboxInputProps) => {
    return (
        <input
            id={id}
            type="checkbox"
            checked={value}
            onChange={e => onChange?.(e.target.checked)}
            disabled={disabled}
            className={`h-4 w-4 text-default ${className}`}
        />
    );
};

export type CheckboxProps = {
    value: boolean;
    onChange: (checked: boolean) => void;
    label?: string | ReactNode;
    id?: string;
    labelPosition?: "left" | "right";
    className?: string;
    inputProps?: Omit<CheckboxInputProps, "value" | "onChange">;
};

export const Checkbox = ({
    value,
    onChange,
    label,
    id,
    labelPosition = "right",
    className = "",
    inputProps = {}
}: CheckboxProps) => {
    const labelContent = label ? (
        <span className="text-sm text-default select-none">{label}</span>
    ) : null;

    return (
        <label htmlFor={id} className={`inline-flex items-center space-x-2 cursor-pointer ${className}`}>
            {labelPosition === "left" && labelContent}
            <CheckboxInput
                value={value}
                id={id}
                onChange={onChange}
                {...inputProps}
            />
            {labelPosition === "right" && labelContent}
        </label>
    );
};