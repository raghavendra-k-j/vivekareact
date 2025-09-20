import type { ReactNode } from "react";
import clsx from "clsx";

export function BrandAppBarContainer({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={clsx(
                "bg-[var(--bc-bg)] text-[var(--bc-text-default)]",
                className
            )}
        >
            {children}
        </div>
    );
}
