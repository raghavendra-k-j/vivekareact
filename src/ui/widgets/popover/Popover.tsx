import * as RadixPopover from "@radix-ui/react-popover";
import * as React from "react";
import type { CssSize } from "~/ui/types/css";
import { toCssSize } from "~/ui/types/css";
import { mergeRefs } from "~/ui/utils/mergeRefs";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";


type PopoverContextProps = {
    open: boolean;
    setOpen(next: boolean): void;

    matchTriggerWidth: boolean;
    viewportPadding: number;

    setTriggerEl(node: HTMLElement | null): void;
    triggerWidth: number | null;
};


const PopoverContext = React.createContext<PopoverContextProps | null>(null);
export function usePopoverContext() {
    const ctx = React.useContext(PopoverContext);
    if (!ctx) throw new Error("Popover compound components must be used inside <Popover>.");
    return ctx;
}


export interface PopoverProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;

    matchTriggerWidth?: boolean;
    viewportPadding?: number;

    children?: React.ReactNode;
}

export function Popover({
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    matchTriggerWidth = false,
    viewportPadding = 12,
    children,
}: PopoverProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? !!controlledOpen : uncontrolledOpen;

    const setOpen = (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
    };

    const [triggerEl, setTriggerEl] = React.useState<HTMLElement | null>(null);
    const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);

    React.useLayoutEffect(() => {
        if (!matchTriggerWidth || !triggerEl) return;

        const setWidth = () => setTriggerWidth(triggerEl.offsetWidth);
        setWidth();

        const ro = new ResizeObserver(setWidth);
        ro.observe(triggerEl);
        window.addEventListener("resize", setWidth);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", setWidth);
        };
    }, [matchTriggerWidth, triggerEl]);

    const ctx: PopoverContextProps = {
        open, setOpen,
        matchTriggerWidth, viewportPadding,
        setTriggerEl,
        triggerWidth,
    };

    return (
        <PopoverContext.Provider value={ctx}>
            <RadixPopover.Root open={open} onOpenChange={setOpen}>
                {children}
            </RadixPopover.Root>
        </PopoverContext.Provider>
    );
}
Popover.displayName = "Popover";

export interface PopoverTriggerProps {
    asChild?: boolean;
    children: React.ReactElement;
}

export function PopoverTrigger({ asChild = true, children }: PopoverTriggerProps) {
    const { setTriggerEl } = usePopoverContext();
    const childRef = (children as any).ref as React.Ref<HTMLElement> | undefined;
    const ref = mergeRefs<HTMLElement>(childRef, setTriggerEl);
    const child = React.cloneElement(children as React.ReactElement<any>, { ref });
    return <RadixPopover.Trigger asChild={asChild}>{child}</RadixPopover.Trigger>;
}
PopoverTrigger.displayName = "PopoverTrigger";


export interface PopoverContentProps extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixPopover.Content>,
    "side" | "align" | "sideOffset" | "avoidCollisions" | "collisionPadding" | "style"
> {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    flip?: boolean;
    collisionPadding?: number | Partial<Record<Side, number>>;

    width?: CssSize;
    minWidth?: CssSize;
    maxWidth?: CssSize;
    minHeight?: CssSize;
    maxHeight?: CssSize;

    className?: string;
    style?: React.CSSProperties;
    portalContainer?: HTMLElement | null;
    disablePortal?: boolean;
    children?: React.ReactNode;
}

export function PopoverContent({
    side = "bottom",
    align = "start",
    sideOffset = 6,
    flip = true,
    collisionPadding = 8,

    width,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,

    className,
    style,
    portalContainer,
    disablePortal = false,
    children,
    ...rest
}: PopoverContentProps) {
    const { matchTriggerWidth, viewportPadding, triggerWidth } = usePopoverContext();

    const vwCap = `calc(100vw - ${viewportPadding * 2}px)`;
    const vhCap = `calc(100vh - ${viewportPadding * 2}px)`;

    const mergedStyle: React.CSSProperties = {
        width: matchTriggerWidth ? (triggerWidth ? `${triggerWidth}px` : undefined) : toCssSize(width),
        minWidth: toCssSize(minWidth),
        maxWidth: maxWidth ? `min(${toCssSize(maxWidth)}, ${vwCap})` : vwCap,
        minHeight: toCssSize(minHeight),
        maxHeight: maxHeight ? `min(${toCssSize(maxHeight)}, ${vhCap})` : vhCap,
        overflow: "auto",
        ...style,
    };

    const content = (
        <RadixPopover.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            avoidCollisions={flip}
            collisionPadding={collisionPadding}
            className={className}
            style={mergedStyle}
            {...rest}
        >
            {children}
        </RadixPopover.Content>
    );

    if (disablePortal) {
        return content;
    }

    return (
        <RadixPopover.Portal container={portalContainer}>
            {content}
        </RadixPopover.Portal>
    );
}
PopoverContent.displayName = "PopoverContent";

export interface PopoverCloseProps {
    asChild?: boolean;
    children: React.ReactElement;
}
export function PopoverClose({ asChild = true, children }: PopoverCloseProps) {
    return <RadixPopover.Close asChild={asChild}>{children}</RadixPopover.Close>;
}
PopoverClose.displayName = "PopoverClose";