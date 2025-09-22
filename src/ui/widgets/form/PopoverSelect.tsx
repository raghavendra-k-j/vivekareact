import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "~/ui/widgets/popover/Popover";
import { ChevronDown } from "lucide-react";
import { InputSize } from "./InputSize";
import clsx from "clsx";

export interface PopoverSelectProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  items: T[] | ReadonlyArray<T>;
  itemRenderer: (item: T) => React.ReactNode | string;
  itemKey: (item: T) => string | number;
  buttonRenderer?: (item: T) => React.ReactNode | string;
  value: T | null;
  onValueChange?: (value: T | null) => void;
  disabled?: boolean;
  inputSize?: InputSize;
  placeholder?: string | React.ReactNode;
  allowEmpty?: boolean;
  hidePlaceholder?: boolean;
  maxWidth?: string | number;
}

function PopoverSelect<T>({
  items,
  itemRenderer,
  itemKey,
  buttonRenderer,
  value,
  onValueChange,
  className = "",
  disabled = false,
  inputSize = "md",
  placeholder = "Select an option",
  allowEmpty = true,
  hidePlaceholder = false,
  maxWidth = "280px",
  ...rest
}: PopoverSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: T | null) => {
    onValueChange?.(item);
    setIsOpen(false);
  };

  return (
    <div className={clsx("popover-select", `popover-select--${inputSize}`, disabled && "is-disabled")} {...rest}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <button
            className={clsx("popover-select__button", className)}
            disabled={disabled}
          >
            <span className="whitespace-nowrap">
              {value ? buttonRenderer?.(value) ?? itemRenderer(value) : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="popover-select__content" style={{ minWidth: '100%', maxWidth }}>
          <div className="py-1 max-h-60 overflow-auto">
            {!hidePlaceholder && allowEmpty && (
              <button
                onClick={() => handleSelect(null)}
                className={clsx(
                  "popover-select__option",
                  !value && "popover-select__option--placeholder"
                )}
              >
                {placeholder}
              </button>
            )}

            {items.map((item) => (
              <button
                key={itemKey(item)}
                onClick={() => handleSelect(item)}
                className={clsx(
                  "popover-select__option",
                  value && itemKey(value) === itemKey(item) && "popover-select__option--selected"
                )}
              >
                {itemRenderer(item)}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { PopoverSelect };