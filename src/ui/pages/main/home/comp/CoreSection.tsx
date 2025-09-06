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
        <section
            className={[
                "rounded-xl border border-default bg-white p-5 shadow-sm",
                className,
            ].join(" ")}
        >
            <div
                className={[
                    "inline-flex h-12 w-12 items-center justify-center rounded-xl",
                    iconBgClass,
                    iconColorClass,
                ].join(" ")}
            >
                {icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-default">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
                {description}
            </p>
        </section>
    );
}

export function SectionHeader({
    title,
    description,
    titleClassName = "text-default",
    descriptionClassName = "text-secondary",
}: {
    title: string;
    description?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}) {
    return (
        <div className="mb-10 text-center">
            <h2
                className={[
                    "text-3xl lg:text-4xl font-bold",
                    titleClassName,
                ].join(" ")}
            >
                {title}
            </h2>
            {description && (
                <p
                    className={[
                        "mt-2 text-lg lg:text-xl max-w-2xl mx-auto",
                        descriptionClassName,
                    ].join(" ")}
                >
                    {description}
                </p>
            )}
        </div>
    );
}

type SectionWrapperProps = {
    gradientClasses: string;
    children: React.ReactNode;
}

export function SectionWrapper(props: SectionWrapperProps) {
    return (
        <section className="relative overflow-hidden">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${props.gradientClasses}`} />
            <div className="relative container px-4 py-16">
                {props.children}
            </div>
        </section>
    );
}