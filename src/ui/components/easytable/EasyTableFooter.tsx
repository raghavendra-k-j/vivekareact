import clsx from "clsx";
import { Observer } from "mobx-react-lite";
import { EasyTableState } from "./types";
import { EasyTablePagination } from "./EasyTablePagination.tsx";
import { EasyTablePaginationCount } from "./EasyTablePaginationCount.tsx";
import { calculatePaginationCount } from "./utils.ts";
import { PopoverSelect } from "~/ui/widgets/form/PopoverSelect";

export interface PageSizeOptions {
    options: number[];
    currentSize: number;
    onSizeChange: (size: number) => void;
}

export interface EasyTableFooterProps {
    dataState: () => EasyTableState<any>;
    onPageChange?: (page: number) => void;
    pageSizeOptions?: () => PageSizeOptions | undefined;
    isEmpty?: boolean;
    className?: string;
}

export function EasyTableFooter({ dataState, onPageChange, pageSizeOptions, isEmpty = false, className }: EasyTableFooterProps) {
    return (
        <Observer>
            {() => {
                const state = dataState();
                const needsTopBorder = state.stateWhen({
                    initOrLoading: () => true,
                    loaded: () => isEmpty,
                    error: () => true
                });

                return (
                    <div className={clsx(
                        "flex items-center justify-between px-4 py-2 bg-surface",
                        needsTopBorder && "border-t border-default",
                        className
                    )}>
                        <div className="flex items-center gap-4">
                            <Observer>
                                {() => {
                                    const state = dataState();
                                    return state.stateWhen({
                                        initOrLoading: () => (
                                            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                                        ),
                                        loaded: (data) => {
                                            const paginationInfo = calculatePaginationCount(data);
                                            return (
                                                <EasyTablePaginationCount 
                                                    startIndex={paginationInfo.startIndex}
                                                    endIndex={paginationInfo.endIndex}
                                                    totalCount={paginationInfo.totalCount}
                                                />
                                            );
                                        },
                                        error: () => null
                                    });
                                }}
                            </Observer>
                            
                            <Observer>
                                {() => {
                                    const options = pageSizeOptions?.();
                                    return options && options.options.length > 0 ? (
                                        <div className="flex items-center gap-2 text-sm text-secondary">
                                            <span>Show:</span>
                                            <PopoverSelect
                                                items={options.options}
                                                value={options.currentSize}
                                                onValueChange={(value) => value && options.onSizeChange(value)}
                                                itemRenderer={(size) => `${size}`}
                                                itemKey={(size) => size}
                                                inputSize="sm"
                                                className="w-20"
                                                hidePlaceholder={true}
                                            />
                                        </div>
                                    ) : null;
                                }}
                            </Observer>
                        </div>
                        <div className="flex items-center">
                            <Observer>
                                {() => {
                                    const state = dataState();
                                    return state.stateWhen({
                                        initOrLoading: () => (
                                            <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
                                        ),
                                        loaded: (data) => {
                                            return (
                                                <EasyTablePagination
                                                    currentPage={data.currentPage}
                                                    totalPages={Math.max(data.totalPages, 1)}
                                                    onPageChange={onPageChange || (() => {})}
                                                />
                                            );
                                        },
                                        error: () => null
                                    });
                                }}
                            </Observer>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
}