export type HomeFeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    iconBgClass?: string;
    iconColorClass?: string;
    className?: string;
};

export function HomeFeatureCard({
    icon,
    title,
    description,
    iconBgClass = "bg-gray-50",
    iconColorClass = "text-gray-700",
    className = "",
}: HomeFeatureCardProps) {
    return (
        <article
            className={[
                "rounded-xl border border-gray-200 bg-white p-5 shadow-sm",
                className,
            ].join(" ")}
        >
            <div
                className={[
                    "inline-flex h-12 w-12 items-center justify-center rounded-lg",
                    iconBgClass,
                    iconColorClass,
                ].join(" ")}
            >
                {icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {description}
            </p>
        </article>
    );
}

export function SectionHeader({
    title,
    titleClassName = "text-gray-900",
}: {
    title: string;
    titleClassName?: string;
}) {
    return (
        <div className="mb-10 text-center">
            <h2 className={["text-3xl lg:text-4xl font-bold", titleClassName].join(" ")}>
                {title}
            </h2>
        </div>
    );
}