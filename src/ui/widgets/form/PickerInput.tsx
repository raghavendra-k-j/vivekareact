import clsx from "clsx";
import * as React from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/ui/widgets/popover/Popover";
import { Input } from "./Input";
import { InputSize } from "./InputSize";

type Key = string | number;

export type SingleSearchOptions<T> = {
  enabled?: boolean;
  placeholder?: string;
  query?: string;
  onQueryChange?: (q: string) => void;
  deriveText?: (item: T) => string;
  filter?: (q: string, item: T) => boolean;
};

export type SingleSelectPickerProps<T> = {
  items: readonly T[];
  getKey: (item: T) => Key;
  getLabel?: (item: T) => React.ReactNode;

  /** value model */
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (val: T | null) => void;

  /** ui */
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  inputSize?: InputSize;

  renderTriggerLabel?: (selected: T | null) => React.ReactNode;
  renderOption?: (item: T, selected: boolean) => React.ReactNode;

  /** popover positioning */
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  flip?: boolean;
  collisionPadding?: number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  matchTriggerWidth?: boolean;
  maxHeight?: number | string;
  viewportPadding?: number;

  className?: string;
  panelClassName?: string;

  searchOptions?: SingleSearchOptions<T>;
};

/** Minimal single-select picker (no context reads) */
export function SingleSelectPicker<T>(props: SingleSelectPickerProps<T>) {
  const {
    items,
    getKey,
    getLabel,
    value,
    defaultValue = null,
    onValueChange,
    placeholder = "Select…",
    readOnly = false,
    disabled = false,
    inputSize = "md",
    renderTriggerLabel,
    renderOption,

    side,
    align,
    sideOffset,
    flip,
    collisionPadding,
    matchTriggerWidth = true,
    maxHeight = 320,
    viewportPadding,

    className,
    panelClassName,
    searchOptions,
  } = props;

  // controlled/uncontrolled value
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<T | null>(defaultValue);
  const selected = (isControlled ? (value as T | null) : internal) ?? null;

  const setSelected = (next: T | null) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  // local open state for aria-expanded (no context)
  const [isOpen, setIsOpen] = React.useState(false);

  // stabilize fns via refs
  const getKeyRef = React.useRef(getKey);
  React.useEffect(() => { getKeyRef.current = getKey; }, [getKey]);

  const getLabelRef = React.useRef(getLabel);
  React.useEffect(() => { getLabelRef.current = getLabel; }, [getLabel]);

  const toKey = React.useCallback((it: T) => getKeyRef.current(it), []);

  // search
  const sEnabled = !!searchOptions?.enabled;
  const sPlaceholder = searchOptions?.placeholder ?? "Search…";
  const sQueryExternal = searchOptions?.query;
  const sOnQueryChange = searchOptions?.onQueryChange;
  const sDerive = searchOptions?.deriveText;
  const sFilter = searchOptions?.filter;

  const [internalQ, setInternalQ] = React.useState("");
  const q = sQueryExternal ?? internalQ;
  const setQ = (next: string) => {
    sOnQueryChange ? sOnQueryChange(next) : setInternalQ(next);
  };

  const defaultDerive = React.useCallback(
    (it: T) => {
      const lbl = getLabelRef.current?.(it);
      if (typeof lbl === "string") return lbl;
      return String(toKey(it));
    },
    [toKey]
  );
  const deriveText = sDerive ?? defaultDerive;

  const defaultFilter = React.useCallback(
    (query: string, it: T) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return deriveText(it).toLowerCase().includes(needle);
    },
    [deriveText]
  );
  const doFilter = sFilter ?? defaultFilter;

  const shownItems = React.useMemo(() => {
    if (!sEnabled || !q) return items as T[];
    return (items as T[]).filter((it) => doFilter(q, it));
  }, [items, sEnabled, q, doFilter]);

  // trigger label
  const triggerLabel = React.useMemo(() => {
    if (renderTriggerLabel) return renderTriggerLabel(selected);
    if (!selected) return placeholder;
    const lbl = getLabelRef.current?.(selected);
    return lbl ?? String(selected ? toKey(selected) : "");
  }, [renderTriggerLabel, selected, placeholder, toKey]);

  const triggerDisabled = disabled || readOnly;
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handlePick = (item: T) => setSelected(item);
  const selectedKey = selected ? toKey(selected) : undefined;

  return (
    <div ref={containerRef} className={clsx("picker", `picker--${inputSize}`, className)}>
      <Popover
        matchTriggerWidth={matchTriggerWidth}
        viewportPadding={viewportPadding}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger>
          <button
            type="button"
            className={clsx("picker__trigger")}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-disabled={triggerDisabled ? "true" : undefined}
            aria-readonly={readOnly ? "true" : undefined}
            disabled={triggerDisabled}
          >
            {triggerLabel}
          </button>
        </PopoverTrigger>

        {!readOnly && (
          <PopoverContent
            side={side}
            align={align}
            sideOffset={sideOffset}
            flip={flip}
            collisionPadding={collisionPadding}
            className={clsx("picker__panel", panelClassName)}
            maxHeight={maxHeight}
            portalContainer={containerRef.current}
          >
            {sEnabled && (
              <div className="picker__search">
                <Input
                  inputSize="sm"
                  placeholder={sPlaceholder}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            )}

            <div role="listbox" className="picker__options">
              {(shownItems as T[]).map((item) => {
                const k = toKey(item);
                const isSelected = selectedKey !== undefined && k === selectedKey;

                const row = (
                  <div
                    role="option"
                    aria-selected={isSelected}
                    data-selected={isSelected ? "true" : "false"}
                    className="picker__option"
                    onClick={() => handlePick(item)}
                  >
                    {renderOption
                      ? renderOption(item, !!isSelected)
                      : (getLabelRef.current ? getLabelRef.current(item) : String(k))}
                  </div>
                );

                // Close the popover after a choice
                return (
                  <PopoverClose key={String(k)}>
                    {row as any}
                  </PopoverClose>
                );
              })}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
