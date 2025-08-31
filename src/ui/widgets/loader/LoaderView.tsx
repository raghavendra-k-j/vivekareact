import clsx from "clsx";
import { Loader2 } from "lucide-react";

export type LoaderViewProps = {
    size?: number;
    animation?: string;
    color?: string;
    className?: string;
};

export function LoaderView(props: LoaderViewProps) {
    const {
        size = 36,
        animation = "animate-spin",
        color = "text-primary",
        className,
    } = props;

    return (
        <Loader2
            size={size}
            className={clsx(animation, color, "rounded-full", className)}
        />
    );
}
