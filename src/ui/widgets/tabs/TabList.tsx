import clsx from "clsx";
import React, { useRef } from "react";
import { useEnableDragScroll } from "~/ui/hooks/useEnableDragScroll";
import styles from "./TabList.module.css";

type TabsListProps = {
    children: React.ReactNode;
    className?: string;
};

export function TabsList({
    children,
    className,
}: TabsListProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEnableDragScroll(containerRef);
    return (
        <div
            ref={containerRef}
            className={clsx(styles.tabList, className, "scrollbar-hide")}
            role="tablist"
            aria-orientation="horizontal"
        >
            {children}
        </div>
    );
}
