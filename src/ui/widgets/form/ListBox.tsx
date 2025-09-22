import React from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { InputSize } from "./InputSize";

export interface ListBoxProps<T> extends React.HTMLAttributes<HTMLDivElement> {
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
}

function ListBox<T>({
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
  ...rest
}: ListBoxProps<T>) {
  return (
    <Listbox value={value} onChange={onValueChange} disabled={disabled}>
      <div className={`listbox listbox--${inputSize} ${className}`} {...rest}>
        <ListboxButton className="listbox__button">
          {value ? buttonRenderer?.(value) ?? itemRenderer(value) : placeholder}
        </ListboxButton>

        <ListboxOptions className="listbox__options">
          {!hidePlaceholder && (
            <ListboxOption
              key="placeholder"
              value={null}
              disabled={!allowEmpty}
              className="listbox__option listbox__option--placeholder"
            >
              {placeholder}
            </ListboxOption>
          )}

          {items.map((item) => (
            <ListboxOption
              key={itemKey(item)}
              value={item}
              className="listbox__option"
            >
              {itemRenderer(item)}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export { ListBox };
