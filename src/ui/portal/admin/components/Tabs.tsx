import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useEnableDragScroll } from "~/ui/hooks/useEnableDragScroll";

export type TabItemProps = {
    label: string;
    onClick: () => void;
    isActive?: boolean;
    className?: string;
};

export function TabItem({ label, onClick, isActive = false, className }: TabItemProps) {
    return (
        <motion.button
            onClick={onClick}
            className={clsx(
                "relative px-3 py-2 transition-colors",
                isActive ? "text-primary-500" : "text-default",
                className
            )}
            transition={{ duration: 0.2 }}
        >
            <span className="relative z-10">{label}</span>
            {isActive && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="activeTabUnderline"
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        duration: 0.3
                    }}
                />
            )}
        </motion.button>
    );
}

export type TabsContainerProps = {
    children: ReactNode;
    className?: string;
};

export function TabsContainer({ children, className }: TabsContainerProps) {
    const tabContainerRef = useRef<HTMLDivElement>(null);
    useEnableDragScroll(tabContainerRef);
    return (
        <LayoutGroup>
            <div ref={tabContainerRef} className={clsx("flex px-4 sm:px-6 font-semibold text-base-m overflow-x-auto w-full", className)}>
                {children}
            </div>
        </LayoutGroup>
    );
}