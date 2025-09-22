
import { PageSizeOptions } from "./EasyTableFooter";

export interface EasyTableColumn<T = any> {
    key: string;
    header: string | React.ReactNode;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';
    flex?: boolean;
    sortable?: boolean;
    renderCell?: (item: T, index: number) => React.ReactNode;
    renderHeader?: () => React.ReactNode;
    cellClassName?: string;
    headerClassName?: string;
}

export interface TableRowProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}


export interface TableCellProps {
    children: React.ReactNode;
    className?: string;
    colSpan?: number;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    onClick?: (e: React.MouseEvent) => void;
}

export interface TableHeaderCellProps extends TableCellProps {
    isSortable?: boolean;
    sortDirection?: 'asc' | 'desc' | null;
    onSortChange?: () => void;
}

export enum EasyTableStateType {
    Init,
    Loading,
    Data,
    Error,
}

export class EasyTableData<T = any> {
    items: T[];
    totalItems: number;
    pageSize: number;
    currentPage: number;

    constructor({ items, totalItems, pageSize, currentPage }: { items: T[]; totalItems: number; pageSize: number; currentPage: number }) {
        this.items = items;
        this.totalItems = totalItems;
        this.pageSize = pageSize;
        this.currentPage = currentPage;
    }

    get totalPages() {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    get hasNextPage() {
        return this.currentPage < this.totalPages;
    }

    get hasPreviousPage() {
        return this.currentPage > 1;
    }

    get isEmpty() {
        return this.items.length === 0;
    }

}

export class EasyTableState<T = any> {

    type: EasyTableStateType;
    data: EasyTableData<T> | null;
    error: Error | null;

    private constructor({ type, data = null, error = null }: { type: EasyTableStateType; data?: EasyTableData<T> | null; error?: Error | null }) {
        this.type = type;
        this.data = data;
        this.error = error;
    }

    static init<T = any>() {
        return new EasyTableState<T>({ type: EasyTableStateType.Init });
    }

    static loading<T = any>() {
        return new EasyTableState<T>({ type: EasyTableStateType.Loading });
    }

    static data<T = any>(data: EasyTableData<T>) {
        return new EasyTableState<T>({ type: EasyTableStateType.Data, data });
    }

    static error<T = any>(error: Error) {
        return new EasyTableState<T>({ type: EasyTableStateType.Error, error });
    }

    get isInit() {
        return this.type === EasyTableStateType.Init;
    }

    get isInitOrLoading() {
        return this.type === EasyTableStateType.Init || this.type === EasyTableStateType.Loading;
    }

    get isLoading() {
        return this.type === EasyTableStateType.Loading;
    }

    get isData() {
        return this.type === EasyTableStateType.Data && this.data !== null;
    }

    get isError() {
        return this.type === EasyTableStateType.Error && this.error !== null;
    }

    stateWhen<TOut>(handlers: {
        initOrLoading: () => TOut;
        loaded: (data: EasyTableData<T>) => TOut;
        error: (error: Error) => TOut;
    }): TOut {
        switch (this.type) {
            case EasyTableStateType.Init:
            case EasyTableStateType.Loading:
                return handlers.initOrLoading();
            case EasyTableStateType.Data:
                return handlers.loaded(this.data as EasyTableData<T>);
            case EasyTableStateType.Error:
                return handlers.error(this.error as Error);
            default:
                throw new Error('Unhandled state in EasyTableState.stateWhen()');
        }
    }
}

export interface EasyTableRetryOptions {
    label?: string;
    onClick: () => void;
}

export interface EasyTableScrollableOptions {
    maxHeight?: string | number;
    stickyHeader?: boolean;
}

export interface EasyTableProps<T = any> {
    columns: EasyTableColumn<T>[];
    dataState: () => EasyTableState<T>;
    getRowKey: (item: T, index: number) => string | number;
    retryOptions?: EasyTableRetryOptions;
    onPageChange?: (page: number) => void;
    onRowClick?: (item: T, index: number, event: React.MouseEvent) => void;
    pageSizeOptions?: () => PageSizeOptions | undefined;

    // Scrolling options - can be boolean or detailed options
    scrollable?: boolean | EasyTableScrollableOptions;

    // Empty state renderer
    renderEmptyState?: () => React.ReactNode;

    containerShadowClassName?: string;
    containerClassName?: string;
    tableClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    rowClassName?: string | ((item: T, index: number) => string);
    footerClassName?: string;
}