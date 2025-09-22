import { Pagination } from "~/ui/widgets/pagination/Pagination";

export interface EasyTablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function EasyTablePagination({
    currentPage,
    totalPages,
    onPageChange,
    className
}: EasyTablePaginationProps) {
    const actualTotalPages = Math.max(totalPages, 1);

    const handleNext = () => {
        if (currentPage < actualTotalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleFirst = () => {
        if (currentPage > 1) {
            onPageChange(1);
        }
    };

    const handleLast = () => {
        if (currentPage < actualTotalPages) {
            onPageChange(actualTotalPages);
        }
    };

    return (
        <div className={className}>
            <Pagination
                currentPage={currentPage}
                totalPages={actualTotalPages}
                onNext={handleNext}
                onPrev={handlePrev}
                onFirst={handleFirst}
                onLast={handleLast}
            />
        </div>
    );
}