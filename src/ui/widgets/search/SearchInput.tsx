import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { Search } from "lucide-react";

const searchInputStyles = cva(
    "w-full border border-[var(--color-input-border)] rounded-[var(--dimen-input-radius)] focus:outline-none focus:ring-2 focus:ring-primary shadow-xs",
    {
        variants: {
            inputSize: {
                xs: "h-8 text-base-m pl-8 pr-2",
                sm: "h-9 text-base-m pl-9 pr-3",
                md: "h-10 text-base pl-10 pr-3",
                lg: "h-11 text-base-p pl-10 pr-3",
                xl: "h-12 text-lg pl-10 pr-5",
            },
        },
        defaultVariants: {
            inputSize: "md",
        },
    }
);

export type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof searchInputStyles> & {
    containerClassName?: string;
};

const iconSizeMap: Record<NonNullable<SearchInputProps["inputSize"]>, number> = {
    xs: 18,
    sm: 18,
    md: 18,
    lg: 20,
    xl: 20,
};

export function SearchInput({ inputSize = "md", containerClassName, className, ...props }: SearchInputProps) {
    const safeInputSize = (inputSize ?? "md") as keyof typeof iconSizeMap;
    return (
        <div className={clsx("relative", containerClassName)}>
            <div className="absolute inset-y-0 left-2 flex items-center text-default pointer-events-none">
                <Search size={iconSizeMap[safeInputSize]} className="text-tertiary" />
            </div>
            <input
                type="search"
                className={clsx(searchInputStyles({ inputSize }), className)}
                {...props}
            />
        </div>
    );
}