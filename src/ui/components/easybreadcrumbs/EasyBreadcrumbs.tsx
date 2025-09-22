import clsx from "clsx";
import React from "react";

export interface BreadcrumbItem<T = any> {
    id: string;
    name: string;
    isClickable?: boolean;
    isCurrent?: boolean;
    data?: T;
}

export interface EasyBreadcrumbsProps<T = any> {
    items: BreadcrumbItem<T>[];
    isLoading?: boolean;
    isError?: boolean;
    separator?: React.ReactNode;
    containerClassName?: string;
    containerMinHeightClassName?: string;
    navClassName?: string;
    onItemClick?: (item: BreadcrumbItem<T>, index: number) => void;
    renderItem: (item: BreadcrumbItem<T>, index: number, isLoading?: boolean) => React.ReactNode;
    renderLoadingItem?: () => React.ReactNode;
    // New prop for trimming
    maxVisibleItems?: number; // Maximum number of items to show before trimming (shows first N-1, ellipsis "...", and last item)
}

export function EasyBreadcrumbs<T = any>({
    items,
    isLoading = false,
    isError = false,
    separator = <span className="text-tertiary mx-1">/</span>,
    containerClassName = "px-4 py-2 bg-surface border-t border-default",
    containerMinHeightClassName = "min-h-12",
    navClassName = "flex items-center space-x-1 text-sm",
    onItemClick,
    renderItem,
    renderLoadingItem,
    maxVisibleItems
}: EasyBreadcrumbsProps<T>) {
    if (isError) {
        return (
            <div className={clsx(containerClassName, containerMinHeightClassName)}>
                <nav className={navClassName} />
            </div>
        );
    }

    const handleItemClick = (item: BreadcrumbItem<T>, index: number) => {
        if (item.isClickable && onItemClick) {
            onItemClick(item, index);
        }
    };

    // Determine which items to display
    let displayItems = items;
    let showEllipsis = false;

    if (maxVisibleItems && items.length > maxVisibleItems && maxVisibleItems > 2) {
        // Show first (maxVisibleItems - 1) items, ellipsis, and last item
        // Example: with maxVisibleItems=5 and 8 items: [0,1,2,3,...,7]
        const firstItems = items.slice(0, maxVisibleItems - 1);
        const lastItem = items[items.length - 1];
        displayItems = [...firstItems, { id: 'ellipsis', name: '...', isClickable: false } as BreadcrumbItem<T>, lastItem];
        showEllipsis = true;
    }

    return (
        <div className={clsx(containerClassName, containerMinHeightClassName)}>
            <nav className={clsx(navClassName, "overflow-x-auto")}>
                {displayItems.map((item, displayIndex) => {
                    // Calculate original index for click handlers
                    let originalIndex = displayIndex;
                    if (showEllipsis && displayIndex === displayItems.length - 2) {
                        // This is the ellipsis item
                        return (
                            <React.Fragment key={item.id}>
                                {displayIndex > 0 && separator}
                                <span className="text-tertiary px-1">...</span>
                            </React.Fragment>
                        );
                    }
                    if (showEllipsis && displayIndex > maxVisibleItems! - 2) {
                        // This is the last item, adjust original index
                        originalIndex = items.length - 1;
                    }

                    return (
                        <React.Fragment key={item.id}>
                            {displayIndex > 0 && separator}
                            <div
                                onClick={() => handleItemClick(item, originalIndex)}
                                className={item.isClickable ? "cursor-pointer" : ""}
                            >
                                {renderItem(item, originalIndex, isLoading)}
                            </div>
                        </React.Fragment>
                    );
                })}
                {isLoading && renderLoadingItem && (
                    <>
                        {displayItems.length > 0 && separator}
                        {renderLoadingItem()}
                    </>
                )}
            </nav>
        </div>
    );
}