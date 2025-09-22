import React from "react";

export interface EasyBreadcrumbItemProps {
    name: string;
    onClick?: () => void;
    isCurrent?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
    className?: string;
    loadingClassName?: string;
}

export function EasyBreadcrumbItem({
    name,
    onClick,
    isCurrent = false,
    isLoading = false,
    icon,
    className = "",
    loadingClassName = ""
}: EasyBreadcrumbItemProps) {
    if (isLoading) {
        return (
            <div className={`flex items-center gap-2 px-2 py-1 ${loadingClassName}`}>
                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className={`h-4 bg-gray-200 animate-pulse rounded ${name === 'Home' ? 'w-12' : 'w-16'}`}></div>
            </div>
        );
    }

    const Component = onClick ? 'button' : 'div';
    const baseClasses = "flex items-center gap-2 px-2 py-1 rounded-md font-medium transition-all duration-150";
    const stateClasses = isCurrent
        ? "bg-gray-100 text-gray-900 ring-1 ring-gray-200"
        : onClick
            ? "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            : "text-gray-600";

    return (
        <Component
            onClick={onClick}
            className={`${baseClasses} ${stateClasses} ${className}`}
        >
            {icon}
            <span>{name}</span>
        </Component>
    );
}