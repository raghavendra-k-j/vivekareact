// ~/ui/components/tabs.tsx
import * as React from "react";
import * as RTabs from "@radix-ui/react-tabs";
import clsx from "clsx";

/* ----------------------------- Types ----------------------------- */

export type TabsClassNames = {
  base?: string;     // wrapper around Root
  tabList?: string;  // <Tabs.List>
  tab?: string;      // each <Tabs.Trigger>
  panel?: string;    // each <Tabs.Content>
};

export type TabsProps = {
  /** Controlled value (string id) */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Fires when selection changes */
  onValueChange?: (value: string) => void;

  /** Orientation for keyboard nav */
  orientation?: "horizontal" | "vertical";
  /** “automatic” (default) activates on focus; “manual” activates on Enter/Space */
  activationMode?: "automatic" | "manual";

  /** Kept for compatibility; only “primary” and “default” palettes below */
  color?: "primary" | "default";

  className?: string;
  classNames?: TabsClassNames;

  children: React.ReactNode;
};

export type TabProps = {
  /** Visible label for the tab trigger */
  title: React.ReactNode;
  /** Stable value for this tab; falls back to index if omitted */
  value?: string;
  /** Disable this tab */
  disabled?: boolean;
  /** Panel contents */
  children?: React.ReactNode;
};

/* -------------------------- Public <Tab/> ------------------------- */
/** Marker component; consumed by <Tabs/> and not rendered directly */
export function Tab(_props: TabProps) {
  return null;
}

/* ---------------------------- Helpers ---------------------------- */

function toItems(children: React.ReactNode): Array<
  Required<Pick<TabProps, "title">> &
  Pick<TabProps, "children" | "disabled" | "value">
> {
  const items: Array<any> = [];
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) return;
    if (child.type !== Tab) return;
    const p = child.props as TabProps;
    items.push({
      title: p.title,
      children: p.children,
      disabled: p.disabled,
      value: p.value ?? String(index),
    });
  });
  return items;
}

/* ------------------------------ UI ------------------------------ */

const triggerBase =
  "relative inline-flex items-center justify-center whitespace-nowrap select-none outline-none " +
  "rounded-md text-sm px-3 py-2 transition focus-visible:ring-2 focus-visible:ring-focus/80 " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  // unselected
  "data-[state=inactive]:text-foreground-600 hover:data-[state=inactive]:bg-content2 " +
  // selected pill + text
  "data-[state=active]:shadow-sm";

const selectedColor = {
  primary:
    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
  default:
    "data-[state=active]:bg-content3 data-[state=active]:text-foreground",
};

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  activationMode = "automatic",
  color = "primary",
  className,
  classNames,
  children,
}: TabsProps) {
  const items = toItems(children);
  const firstEnabled = items.find((i) => !i.disabled)?.value ?? items[0]?.value ?? "0";

  // Build props so we never pass value+defaultValue together
  const rootProps =
    value !== undefined
      ? ({ value, onValueChange } as const)
      : ({ defaultValue: defaultValue ?? firstEnabled, onValueChange } as const);

  return (
    <RTabs.Root
      orientation={orientation}
      activationMode={activationMode}
      className={clsx("flex flex-col gap-4", classNames?.base, className)}
      {...rootProps}
    >
      <RTabs.List
        className={clsx(
          "inline-flex gap-1 p-1 rounded-medium bg-surface border border-default",
          classNames?.tabList
        )}
        aria-label="tabs"
      >
        {items.map((item) => (
          <RTabs.Trigger
            key={item.value}
            value={item.value!}
            disabled={item.disabled}
            className={clsx(triggerBase, selectedColor[color], classNames?.tab)}
          >
            {item.title}
          </RTabs.Trigger>
        ))}
      </RTabs.List>

      {items.map((item) => (
        <RTabs.Content
          key={item.value}
          value={item.value!}
          className={clsx("w-full", classNames?.panel)}
        >
          {item.children}
        </RTabs.Content>
      ))}
    </RTabs.Root>
  );
}

export default Tabs;
