import { ReactNode, useRef, useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { EasySelectContext, useEasySelectStore } from "./EasySelectContext";
import { EasySelectStore } from "./EasySelectStore";
import { Popover, PopoverTrigger, PopoverContent } from "../popover/Popover";
import { SearchInput } from "../search/SearchInput";
import { Checkbox } from "../form/Checkbox";
import { Button } from "../button/Button";
import { Check } from "lucide-react";
import clsx from "clsx";

export type EasySelectProps<T> = {
    // Core props
    items: T[];
    getItemId: (item: T) => string;
    getItemLabel: (item: T) => ReactNode;
    onResult: (selectedItems: T[]) => void;
    
    // Behavior
    isMultiSelect?: boolean;
    initialSelection?: Set<string>;
    
    // UI customization
    trigger: ReactNode;
    placeholder?: string;
    searchPlaceholder?: string;
    maxHeight?: string;
    className?: string;
    
    // Popover props
    popoverProps?: {
        side?: "top" | "right" | "bottom" | "left";
        align?: "start" | "center" | "end";
        sideOffset?: number;
        matchTriggerWidth?: boolean;
    };
};

function EasySelectContent<T>() {
    const store = useEasySelectStore<T>();
    
    return (
        <Observer>
            {() => (
                <div className="w-full min-w-64 max-w-md">
                    {/* Search Input */}
                    <div className="p-3 border-b border-default">
                        <SearchInput
                            placeholder={store.searchPlaceholder || "Search items..."}
                            value={store.searchText}
                            onChange={(e) => store.setSearchText(e.target.value)}
                            inputSize="sm"
                        />
                    </div>
                    
                    {/* Items List */}
                    <div 
                        className="py-2 max-h-60 overflow-y-auto"
                        style={{ maxHeight: store.maxHeight || "15rem" }}
                    >
                        {store.filteredItems.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-tertiary text-center">
                                {store.searchText ? "No items found" : "No items available"}
                            </div>
                        ) : (
                            store.filteredItems.map((item) => {
                                const itemId = store.getItemId(item);
                                const isSelected = store.selectedIds.has(itemId);
                                
                                return (
                                    <div
                                        key={itemId}
                                        className={clsx(
                                            "flex items-center px-4 py-2 cursor-pointer transition-colors hover:bg-slate-50",
                                            isSelected && "bg-primary/5"
                                        )}
                                        onClick={() => store.toggleSelection(itemId)}
                                    >
                                        {store.isMultiSelect ? (
                                            <Checkbox
                                                value={isSelected}
                                                onChange={() => store.toggleSelection(itemId)}
                                                className="mr-3"
                                            />
                                        ) : (
                                            <div className="mr-3 w-4 h-4 flex items-center justify-center">
                                                {isSelected && (
                                                    <Check size={14} className="text-primary" />
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 text-sm">
                                            {store.getItemLabel(item)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    
                    {/* Footer - only show for multi-select */}
                    {store.isMultiSelect && (
                        <div className="p-3 border-t border-default flex items-center justify-between">
                            <div className="text-xs text-tertiary">
                                {store.selectedIds.size} selected
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    color="secondary"
                                    onClick={() => store.clearSelection()}
                                    disabled={store.selectedIds.size === 0}
                                >
                                    Clear
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => store.setOpen(false)}
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Observer>
    );
}

function EasySelectProvider<T>({ 
    children, 
    ...props 
}: { children: React.ReactNode } & EasySelectProps<T>) {
    const storeRef = useRef<EasySelectStore<T> | null>(null);
    
    if (!storeRef.current) {
        storeRef.current = new EasySelectStore<T>();
    }
    
    const store = storeRef.current;
    
    // Update store with props
    useEffect(() => {
        store.setItems(props.items);
        store.setConfig({
            getItemId: props.getItemId,
            getItemLabel: props.getItemLabel,
            isMultiSelect: props.isMultiSelect || false,
            onResult: props.onResult,
            initialSelection: props.initialSelection,
        });
        
        // Set other properties
        store.searchPlaceholder = props.searchPlaceholder;
        store.maxHeight = props.maxHeight;
    }, [
        props.items,
        props.getItemId,
        props.getItemLabel,
        props.isMultiSelect,
        props.onResult,
        props.initialSelection,
        props.searchPlaceholder,
        props.maxHeight,
        store
    ]);
    
    return (
        <EasySelectContext.Provider value={store}>
            {children}
        </EasySelectContext.Provider>
    );
}

export function EasySelect<T>(props: EasySelectProps<T>) {
    const {
        trigger,
        className,
        popoverProps = {},
    } = props;
    
    return (
        <EasySelectProvider {...props}>
            <div className={clsx("inline-block", className)}>
                <Popover
                    matchTriggerWidth={popoverProps.matchTriggerWidth ?? true}
                >
                    <Observer>
                        {() => {
                            const store = useEasySelectStore<T>();
                            return (
                                <PopoverTrigger>
                                    <div onClick={() => store.setOpen(!store.isOpen)}>
                                        {trigger}
                                    </div>
                                </PopoverTrigger>
                            );
                        }}
                    </Observer>
                    
                    <PopoverContent
                        side={popoverProps.side || "bottom"}
                        align={popoverProps.align || "start"}
                        sideOffset={popoverProps.sideOffset || 4}
                        className="bg-white border border-default rounded-lg shadow-lg p-0"
                    >
                        <EasySelectContent<T> />
                    </PopoverContent>
                </Popover>
            </div>
        </EasySelectProvider>
    );
}