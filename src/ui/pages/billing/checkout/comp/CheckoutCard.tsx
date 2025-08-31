import clsx from "clsx";

export function CheckoutCard({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={clsx("bg-surface shadow-md border border-default rounded-sm", className)}>
            {children}
        </div>
    );
}

export function CheckoutCardHeader({ title, description }: { title: string, description?: string }) {
    return (
        <div className="mb-2">
            <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-semibold tracking-tight text-default">
                    {title}
                </h2>
            </div>
            {description && <p className="text-sm text-secondary mt-1">{description}</p>}
        </div>
    );
}
