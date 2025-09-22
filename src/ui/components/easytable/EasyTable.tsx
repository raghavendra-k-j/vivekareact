import clsx from "clsx";
import { Observer } from "mobx-react-lite";
import { RefreshCw } from "lucide-react";
import { AppError } from "~/core/error/AppError";
import { SimpleErrorView } from "~/ui/widgets/error/SimpleErrorView";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { Button } from "~/ui/widgets/button/Button";
import { EasyTableColumn, EasyTableProps, EasyTableRetryOptions } from "./types";
import { EasyTableFooter } from "./EasyTableFooter";

export function EasyTable<T = any>(props: EasyTableProps<T>) {
    const { containerClassName, containerShadowClassName = "shadow-sm", footerClassName, pageSizeOptions, scrollable } = props;

    const hasFlexColumns = props.columns.some(col => col.flex);
    const tableLayoutClass = hasFlexColumns ? "table-auto" : "table-fixed";

    // Parse scrollable options
    const scrollableOptions = typeof scrollable === 'object' ? scrollable : scrollable ? {} : null;
    const isScrollable = scrollableOptions !== null;
    const stickyHeader = scrollableOptions?.stickyHeader ?? true; // Default to sticky header when scrolling
    const maxHeight = scrollableOptions?.maxHeight;

    const tableContent = (
        <table className={clsx("w-full", tableLayoutClass, props.tableClassName)}>
            <TableHeader
                columns={props.columns}
                sticky={isScrollable && stickyHeader}
                className={props.headerClassName}
            />
            <Observer>
                {() => {
                    const dataState = props.dataState();

                    return dataState.stateWhen({
                        initOrLoading: () => <LoadingTableBody columns={props.columns} className={props.bodyClassName} />,
                        loaded: (data) => (
                            data.isEmpty && props.renderEmptyState ? (
                                <EmptyTableBody columns={props.columns} renderEmptyState={props.renderEmptyState} className={props.bodyClassName} />
                            ) : (
                                <DataTableBody
                                    columns={props.columns}
                                    data={data.items}
                                    getRowKey={props.getRowKey}
                                    onRowClick={props.onRowClick}
                                    className={props.bodyClassName}
                                    rowClassName={props.rowClassName}
                                />
                            )
                        ),
                        error: (error) => <ErrorTableBody columns={props.columns} error={error} retryOptions={props.retryOptions} className={props.bodyClassName} />
                    });
                }}
            </Observer>
        </table>
    );

    const renderFooter = () => {
        const dataState = props.dataState();
        const isEmpty = dataState.isData && dataState.data!.isEmpty && !!props.renderEmptyState;

        return (
            <EasyTableFooter
                dataState={props.dataState}
                onPageChange={props.onPageChange}
                pageSizeOptions={pageSizeOptions}
                isEmpty={isEmpty}
                className={footerClassName}
            />
        );
    };

    if (isScrollable) {
        return (
            <div className={clsx("datatable w-full bg-surface flex flex-col min-h-0", containerShadowClassName, containerClassName)}>
                <div
                    className="overflow-auto flex-1 min-h-0"
                    style={maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : undefined}
                >
                    {tableContent}
                </div>
                {renderFooter()}
            </div>
        );
    }

    return (
        <div className={clsx("datatable w-full bg-surface", containerShadowClassName, containerClassName)}>
            {tableContent}
            {renderFooter()}
        </div>
    );
}

function TableHeader<T>({ columns, sticky = false, className }: { columns: EasyTableColumn<T>[]; sticky?: boolean; className?: string }) {
    return (
        <thead className={clsx(sticky && "sticky top-0 z-10 bg-surface shadow-xs", className)}>
            <tr>
                {columns.map((col) => {
                    const headerAlign = col.headerAlign || col.align || 'left';

                    const style: React.CSSProperties = {};

                    if (col.flex) {
                        if (col.minWidth) {
                            style.minWidth = col.minWidth;
                        }
                        if (col.maxWidth) {
                            style.maxWidth = col.maxWidth;
                        }
                    } else {
                        if (col.width) {
                            style.width = col.width;
                        }
                        if (col.minWidth) {
                            style.minWidth = col.minWidth;
                        }
                        if (col.maxWidth) {
                            style.maxWidth = col.maxWidth;
                        }
                    }

                    return (
                        <th
                            key={col.key}
                            className={clsx(
                                "px-4 py-1 text-sm font-semibold text-secondary bg-surface border-b border-default",
                                headerAlign === 'left' && 'text-left',
                                headerAlign === 'center' && 'text-center',
                                headerAlign === 'right' && 'text-right',
                                col.headerClassName
                            )}
                            style={style}
                        >
                            {col.renderHeader ? col.renderHeader() : col.header}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}




function DataTableBody<T>({ columns, data, getRowKey, onRowClick, className, rowClassName }: {
    columns: EasyTableColumn<T>[];
    data: T[];
    getRowKey: (item: T, index: number) => string | number;
    onRowClick?: (item: T, index: number, event: React.MouseEvent) => void;
    className?: string;
    rowClassName?: string | ((item: T, index: number) => string);
}) {
    return (
        <tbody className={className}>
            {data.map((item, rowIndex) => (
                <tr
                    key={getRowKey(item, rowIndex)}
                    className={clsx(
                        "hover:bg-gray-50",
                        onRowClick && "cursor-pointer",
                        typeof rowClassName === 'function' ? rowClassName(item, rowIndex) : rowClassName
                    )}
                    onClick={(event) => onRowClick?.(item, rowIndex, event)}
                >
                    {columns.map((col) => {
                        const style: React.CSSProperties = {};

                        if (col.flex) {
                            if (col.minWidth) {
                                style.minWidth = col.minWidth;
                            }
                            if (col.maxWidth) {
                                style.maxWidth = col.maxWidth;
                            }
                        } else {
                            if (col.width) {
                                style.width = col.width;
                            }
                            if (col.minWidth) {
                                style.minWidth = col.minWidth;
                            }
                            if (col.maxWidth) {
                                style.maxWidth = col.maxWidth;
                            }
                        }

                        return (
                            <td
                                key={col.key}
                                className={clsx(
                                    "px-4 py-2 text-sm text-default border-b border-default",
                                    col.align === 'center' && 'text-center',
                                    col.align === 'right' && 'text-right',
                                    col.cellClassName
                                )}
                                style={style}
                            >
                                {col.renderCell ? col.renderCell(item, rowIndex) : (item as any)[col.key]}
                            </td>
                        );
                    })}
                </tr>
            ))}
        </tbody>
    );
}


function LoadingTableBody({ columns, className }: { columns: EasyTableColumn<any>[]; className?: string }) {
    return (
        <tbody className={className}>
            <tr>
                <td colSpan={columns.length} className="p-6 text-center min-h-24">
                    <div className="flex justify-center items-center">
                        <LoaderView />
                    </div>
                </td>
            </tr>
        </tbody>
    );
}


function EmptyTableBody({ columns, renderEmptyState, className }: { columns: EasyTableColumn<any>[]; renderEmptyState: () => React.ReactNode; className?: string }) {
    return (
        <tbody className={className}>
            <tr>
                <td colSpan={columns.length} className="p-6 text-center">
                    {renderEmptyState()}
                </td>
            </tr>
        </tbody>
    );
}


function ErrorTableBody({ columns, error, retryOptions, className }: { columns: EasyTableColumn<any>[]; error: Error; retryOptions?: EasyTableRetryOptions; className?: string }) {
    let message: string = ""
    let description: string | null | undefined;
    if (error instanceof AppError) {
        message = error.message;
        description = error.description;
    }

    const retryAction = retryOptions ? (
        <Button
            variant="outline"
            size="sm"
            onClick={retryOptions.onClick}
            icon={<RefreshCw className="w-4 h-4" />}
        >
            {retryOptions.label || "Retry"}
        </Button>
    ) : null;

    return (
        <tbody className={className}>
            <tr>
                <td colSpan={columns.length}>
                    <SimpleErrorView
                        message={message}
                        description={description}
                        className="p-6"
                        actions={retryAction}
                    />
                </td>
            </tr>
        </tbody>
    );
}