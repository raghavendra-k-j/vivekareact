import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import * as React from "react";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

type EasyDropDownContextProps = {
    open: boolean;
    setOpen(next: boolean): void;
};

const EasyDropDownContext = React.createContext<EasyDropDownContextProps | null>(null);

export function useEasyDropDownContext() {
    const ctx = React.useContext(EasyDropDownContext);
    if (!ctx) throw new Error("EasyDropDown compound components must be used inside <EasyDropDown>.");
    return ctx;
}

export interface EasyDropDownProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function EasyDropDown({
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    children,
}: EasyDropDownProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? !!controlledOpen : uncontrolledOpen;

    const setOpen = (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
    };

    const ctx: EasyDropDownContextProps = {
        open,
        setOpen,
    };

    return (
        <EasyDropDownContext.Provider value={ctx}>
            <RadixDropdownMenu.Root open={open} onOpenChange={setOpen}>
                {children}
            </RadixDropdownMenu.Root>
        </EasyDropDownContext.Provider>
    );
}
EasyDropDown.displayName = "EasyDropDown";

export interface EasyDropDownTriggerProps {
    asChild?: boolean;
    children: React.ReactElement;
}

export function EasyDropDownTrigger({ asChild = true, children }: EasyDropDownTriggerProps) {
    return <RadixDropdownMenu.Trigger asChild={asChild}>{children}</RadixDropdownMenu.Trigger>;
}
EasyDropDownTrigger.displayName = "EasyDropDownTrigger";

export interface EasyDropDownContentProps extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>,
    "side" | "align" | "sideOffset" | "avoidCollisions" | "collisionPadding"
> {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    flip?: boolean;
    collisionPadding?: number | Partial<Record<Side, number>>;
    className?: string;
    children?: React.ReactNode;
}

export function EasyDropDownContent({
    side = "bottom",
    align = "end",
    sideOffset = 4,
    flip = true,
    collisionPadding = 8,
    className = "min-w-[160px] bg-white rounded-md border border-gray-200 shadow-lg p-1 z-50",
    children,
    ...rest
}: EasyDropDownContentProps) {
    return (
        <RadixDropdownMenu.Portal>
            <RadixDropdownMenu.Content
                side={side}
                align={align}
                sideOffset={sideOffset}
                avoidCollisions={flip}
                collisionPadding={collisionPadding}
                className={className}
                {...rest}
            >
                {children}
            </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Portal>
    );
}
EasyDropDownContent.displayName = "EasyDropDownContent";

export interface EasyDropDownItemProps extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>,
    "className"
> {
    icon?: React.ReactNode;
    children: React.ReactNode;
    variant?: "default" | "destructive";
    disabled?: boolean;
    className?: string;
}

export function EasyDropDownItem({
    icon,
    children,
    variant = "default",
    disabled = false,
    className = "",
    ...rest
}: EasyDropDownItemProps) {
    const baseClasses = "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-sm outline-none";
    const variantClasses = {
        default: "text-gray-700 hover:bg-gray-50",
        destructive: "text-red-600 hover:bg-red-50",
    };
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

    return (
        <RadixDropdownMenu.Item
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
            disabled={disabled}
            {...rest}
        >
            {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
            {children}
        </RadixDropdownMenu.Item>
    );
}
EasyDropDownItem.displayName = "EasyDropDownItem";

export interface EasyDropDownSeparatorProps {
    className?: string;
}

export function EasyDropDownSeparator({ className = "h-px bg-gray-200 my-1" }: EasyDropDownSeparatorProps) {
    return <RadixDropdownMenu.Separator className={className} />;
}
EasyDropDownSeparator.displayName = "EasyDropDownSeparator";