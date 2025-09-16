import clsx from "clsx";
import React from "react";
import styles from "./TabList.module.css";

type TabItemProps = {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    onClick?: (ev?: React.MouseEvent) => void;
};

export const TabItem = React.forwardRef<HTMLButtonElement, TabItemProps>(function TabItem(
    { children, className, onClick, isActive, ...rest },
    ref
) {
    return (
        <button
            onClick={onClick}
            ref={ref}
            type="button"
            role="tab"
            {...rest}
            aria-selected={isActive}
            className={clsx(styles.tabItem, className, isActive && styles.tabItemActive)}
        >
            {children}
        </button>
    );
});
