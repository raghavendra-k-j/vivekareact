import { Check, Minus } from "lucide-react";

export function EasyTableSelect({ selected, onChange, disabled, intermediate }: { selected: boolean; onChange: (selected: boolean) => void; disabled?: boolean; intermediate?: boolean }) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!disabled) {
            onChange(!selected);
        }
    };

    const showCheck = selected && !intermediate;
    const showMinus = intermediate;

    return (
        <div
            onClick={handleClick}
            className={`
                p-2 rounded flex items-center justify-center transition-colors
                ${disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-primary-100'
                }
            `}
        >
            <div
                className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                    ${intermediate
                        ? (disabled
                            ? 'bg-gray-300 border-gray-300'
                            : 'bg-primary-200 border-primary-400'
                          )
                        : selected
                        ? (disabled
                            ? 'bg-gray-300 border-gray-300'
                            : 'bg-primary-600 border-primary-600'
                          )
                        : (disabled
                            ? 'border-gray-300'
                            : 'border-gray-300 hover:border-primary-400 hover:shadow-sm'
                          )
                    }
                `}
            >
                {showCheck && (
                    <Check
                        className={`w-3 h-3 ${disabled ? 'text-gray-500' : 'text-white'}`}
                        strokeWidth={3}
                    />
                )}
                {showMinus && (
                    <Minus
                        className={`w-3 h-3 ${disabled ? 'text-gray-500' : 'text-primary-600'}`}
                        strokeWidth={3}
                    />
                )}
            </div>
        </div>
    );
}