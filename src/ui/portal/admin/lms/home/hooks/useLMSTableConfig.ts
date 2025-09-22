import { useMemo } from "react";
import { EasyTableRetryOptions } from "~/ui/components/easytable";

export interface UseLMSTableConfigOptions {
    onReload: () => void;
    onPageChange: (page: number) => void;
}

export function useLMSTableConfig({
    onReload,
    onPageChange,
}: UseLMSTableConfigOptions) {
    const retryOptions: EasyTableRetryOptions = useMemo(() => ({
        onClick: onReload,
    }), [onReload]);

    const tableProps = {
        retryOptions,
        onPageChange,
        scrollable: true as const
    };

    return {
        retryOptions,
        tableProps,
    };
}


export function getLMSPageSizeOptions(pageSize: number, onPageSizeChange: (size: number) => void) {
    const pageSizeOptions = {
        options: [10, 25, 50, 100],
        currentSize: pageSize,
        onSizeChange: onPageSizeChange
    };
    return pageSizeOptions;
}