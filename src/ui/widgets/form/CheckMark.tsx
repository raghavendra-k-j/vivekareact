import { Check } from "lucide-react";
import clsx from "clsx";

export type CheckMarkProps = {
    value: boolean;
    id?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    width?: string;
    height?: string;
};

export const CheckMark = ({ value, id, className = '', disabled, onChange, width = 'w-4', height = 'h-4' }: CheckMarkProps) => {
    return (
        <div
            className={clsx(
                'relative inline-block cursor-pointer',
                width,
                height,
                {
                    'cursor-not-allowed opacity-50': disabled,
                },
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onChange?.(!value);
            }}
        >
            <input
                id={id}
                type="checkbox"
                checked={value}
                onChange={e => onChange?.(e.target.checked)}
                disabled={disabled}
                className="sr-only"
            />
            <div className={clsx(
                'w-full h-full border-2 rounded transition-colors flex items-center justify-center',
                {
                    'bg-primary border-primary': value,
                    'bg-white border-gray-300 hover:border-primary': !value && !disabled,
                    'border-gray-200': disabled,
                }
            )}>
                {value && (
                    <Check size={12} className="text-white" />
                )}
            </div>
        </div>
    );
};