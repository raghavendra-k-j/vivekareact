import clsx from "clsx";
import { Loader2 } from "lucide-react";

export type LoaderViewProps = {
    size?: number;
    color?: string;
    className?: string;
};

export function LoaderView({
    size = 36,
    color = "text-primary",
    className,
}: LoaderViewProps) {
    return (
        <Loader2
            size={size}
            className={clsx(
                color,
                "animate-spin",
                className
            )}
        />
    );
}
