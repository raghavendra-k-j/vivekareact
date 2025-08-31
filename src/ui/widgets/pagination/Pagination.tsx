import { ChevronsLeft, ChevronsRight } from "lucide-react";
import clsx from "clsx";
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
    onFirst: () => void;
    onLast: () => void;
}

const PaginationButton = ({
    children,
    onClick,
    disabled,
    isFirst = false,
    isLast = false,
    hasLeftBorder = false,
    className,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    hasLeftBorder?: boolean;
    className?: string;
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "text-default px-3 py-1 flex items-center justify-center bg-surface hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs",
                {
                    "border-l border-gray-300": hasLeftBorder,
                    "rounded-l-[var(--dimen-button-radius)]": isFirst,
                    "rounded-r-[var(--dimen-button-radius)]": isLast,
                    "rounded-none": !isFirst && !isLast,
                },
                className
            )}
        >
            {children}
        </button>
    );
};

export const Pagination = ({
    currentPage,
    totalPages,
    onNext,
    onPrev,
    onFirst,
    onLast,
}: PaginationProps) => {
    return (
        <div className="inline-flex overflow-hidden shadow-xs rounded-[var(--dimen-button-radius)] border border-gray-300">
            <PaginationButton
                onClick={onFirst}
                disabled={currentPage === 1}
                isFirst
            >
                <ChevronsLeft size={16} />
            </PaginationButton>
            <PaginationButton
                onClick={onPrev}
                disabled={currentPage === 1}
                hasLeftBorder
            >
                Prev
            </PaginationButton>
            <PaginationButton disabled className="cursor-default font-medium" hasLeftBorder>
                {currentPage} / {totalPages}
            </PaginationButton>
            <PaginationButton
                onClick={onNext}
                disabled={currentPage === totalPages}
                hasLeftBorder
            >
                Next
            </PaginationButton>
            <PaginationButton
                onClick={onLast}
                disabled={currentPage === totalPages}
                isLast
                hasLeftBorder
            >
                <ChevronsRight size={16} />
            </PaginationButton>
        </div>
    );
};
