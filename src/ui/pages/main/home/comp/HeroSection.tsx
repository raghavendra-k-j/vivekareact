import { ArrowRight, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "~/ui/components/buttons/button";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

export function HeroSection() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const onResize = () => setIsDesktop(window.innerWidth > 1026);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white" />
            <div className="relative container px-4">
                <div
                    className={[
                        "grid items-start gap-12 pt-8 pb-16",
                        isDesktop ? "grid-cols-2" : "grid-cols-1",
                    ].join(" ")}
                >
                    <HeroIntro isDesktop={isDesktop} />
                    <HeroFeatures />
                </div>
            </div>
        </section>
    );
}

function HeroIntro({ isDesktop }: { isDesktop: boolean }) {
    return (
        <div className={isDesktop ? "text-left" : "text-center"}>
            <div className="mb-4 inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
                VIVEKA — Assessments and Surveys, powered by AI
            </div>

            <h1
                className={[
                    "mb-5 font-bold leading-tight text-gray-900",
                    isDesktop ? "text-5xl" : "text-4xl",
                ].join(" ")}
            >
                Create <span className="text-purple-600">Assessments</span> &{" "}
                <span className="text-pink-600">Surveys</span>
                <span className="block">in Minutes</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
                Turn your prompts, documents, or books into tailored Assessments & Surveys.
                Save time, generate high-quality questions, auto-evaluate responses,
                and get detailed reports effortlessly.
            </p>

            <div
                className={[
                    "flex gap-3",
                    isDesktop ? "justify-start" : "justify-center",
                ].join(" ")}
            >
                <Link to="/signup">
                    <Button size="lg">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

function HeroFeatures() {
    const items = useMemo(
        () => [
            {
                text: "AI-powered Assessment & Survey Generation",
                description:
                    "Create Assessments or Surveys instantly from a prompt, document, or book.",
            },
            {
                text: "AI-powered Evaluation",
                description:
                    "Automatically grade and evaluate responses with AI to save time and reduce bias.",
            },
            {
                text: "Detailed Reports & Analytics",
                description: "Get performance insights, trends, and summaries at a glance.",
            },
            {
                text: "Support for Equations",
                description:
                    "Handle mathematical and scientific equations seamlessly in Assessments.",
            },
            {
                text: "AI-based Auto Translation",
                description:
                    "Translate your Assessments and Surveys into multiple languages with just one click using AI.",
            },
            { text: "…and many more", description: undefined },
        ],
        []
    );

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const handleToggle = (idx: number) =>
        setOpenIndex((cur) => (cur === idx ? null : idx));

    return (
        <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    AI-powered tools for Assessments & Surveys
                </h3>
                <ul className="space-y-3 text-gray-800">
                    {items.map((item, idx) => (
                        <HeroFeatureItem
                            key={item.text}
                            text={item.text}
                            description={item.description}
                            open={openIndex === idx}
                            onToggle={() => handleToggle(idx)}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

function HeroFeatureItem({
    text,
    description,
    open,
    onToggle,
}: {
    text: string;
    description?: string;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <li
            className={[
                "flex flex-col rounded-md",
                open ? "bg-primary-50/60" : "",
            ].join(" ")}
        >
            <button
                type="button"
                aria-expanded={open}
                className="flex items-start gap-2 px-2 py-2 text-left"
                onClick={onToggle}
            >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span className="flex-1 font-medium">{text}</span>
                {description ? (
                    <span className="ml-1 text-gray-400">
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                ) : null}
            </button>

            {description && open && (
                <p className="ml-9 pr-2 text-sm text-gray-600">{description}</p>
            )}
        </li>
    );
}
