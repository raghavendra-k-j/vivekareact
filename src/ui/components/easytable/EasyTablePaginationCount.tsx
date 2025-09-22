export interface EasyTablePaginationCountProps {
    startIndex: number;
    endIndex: number;
    totalCount: number;
    className?: string;
}

export function EasyTablePaginationCount({
    startIndex,
    endIndex,
    totalCount,
    className
}: EasyTablePaginationCountProps) {
    if (totalCount === 0) {
        return (
            <span className={`text-sm text-secondary ${className || ''}`}>
                No records found
            </span>
        );
    }

    return (
        <span className={`text-sm text-secondary ${className || ''}`}>
            Showing {startIndex} to {endIndex} of {totalCount} records
        </span>
    );
}