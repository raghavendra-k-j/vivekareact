import React from "react";
import { ClipboardList, ScanText, Database } from "lucide-react";
import { Button } from "~/ui/widgets/button/Button";
import { SectionHeader, SectionWrapper } from "./CoreSection";


export function ProductsSection() {
    const products = [
        {
            icon: <ClipboardList className="h-6 w-6" />,
            iconBgClass: "bg-indigo-100",
            iconColorClass: "text-indigo-700",
            title: "Assessment and Survey Tool",
            description:
                "Create customized assessments and surveys effortlessly with our AI-powered tool. Upload a document or paste content, and our AI will generate tailored questions. Analyze the results with detailed reports to gain insights into response trends and performance metrics.",
            ctaLabel: "Continue",
            href: "https://vivekaa.in",
        },
        {
            icon: <Database className="h-6 w-6" />,
            iconBgClass: "bg-teal-100",
            iconColorClass: "text-teal-700",
            title: "DbAssistant.AI",
            description:
                "Simplify your database queries with DbAssistant.AI. Utilize natural language to generate accurate outputs in table format, receive summarized insights for easy interpretation, and visualize data with interactive charts.",
            ctaLabel: "Continue",
            href: "https://dbassistantai.vivekaa.in",
        },
        {
            icon: <ScanText className="h-6 w-6" />,
            iconBgClass: "bg-rose-100",
            iconColorClass: "text-rose-700",
            title: "Document Scanner",
            description:
                "Unlock advanced OCR with our AI Document Scanner. Effortlessly extract and structure data from printed, handwritten, or complex diagrams and images, then seamlessly integrate this organized information into your preferred database for improved data management and analysis.",
            ctaLabel: "Continue",
            href: "https://docscanner.vivekaa.in",
        },
    ];

    return (
        <SectionWrapper gradientClasses="from-indogo-50 via-white to-indogo-50">
            <SectionHeader
                title="Products"
                description="Discover what’s ready today, or collaborate with us on something custom."
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                    <ProductCard
                        key={p.title}
                        icon={p.icon}
                        iconBgClass={p.iconBgClass}
                        iconColorClass={p.iconColorClass}
                        title={p.title}
                        description={p.description}
                        ctaLabel={p.ctaLabel}
                        href={p.href}
                    />
                ))}
            </div>
        </SectionWrapper>
    );
}

function ProductCard({
    icon,
    iconBgClass,
    iconColorClass,
    title,
    description,
    ctaLabel = "Continue",
    href,
    onClick,
}: {
    icon: React.ReactNode;
    iconBgClass?: string;
    iconColorClass?: string;
    title: string;
    description: string;
    ctaLabel?: string;
    href?: string;
    onClick?: () => void;
}) {
    const handleClick = () => {
        if (onClick) return onClick();
        if (href) window.open(href, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="flex h-full flex-col rounded-xl border border-default bg-surface p-6 shadow-sm">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}>
                        <div className={iconColorClass}>{icon}</div>
                    </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-default">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">{description}</p>
            </div>
            <Button onClick={handleClick} className="mt-6 w-full">
                {ctaLabel}
            </Button>
        </div>
    );
}
