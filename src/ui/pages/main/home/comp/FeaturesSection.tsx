import {
    ArrowLeftRight,
    BadgeCheck,
    BarChart3,
    BookOpen,
    FileText,
    Languages,
    Mic,
    Sigma,
    Zap
} from "lucide-react";
import { HomeFeatureCard, SectionHeader, SectionWrapper } from "./CoreSection";


export function FeaturesSection() {
    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "AI-powered Assessment & Survey Generation",
            description:
                "Generate tailored Assessments or Surveys from a prompt or document — in minutes.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <BadgeCheck className="w-6 h-6" />,
            title: "AI-powered Evaluation (Assessments)",
            description:
                "Automatic grading, rubric-aligned scoring, and instant feedback for Assessments.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Detailed Reports & Analytics",
            description:
                "Clear score breakdowns, trends, and cohort insights you can act on.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <Sigma className="w-6 h-6" />,
            title: "Support for Equations",
            description:
                "Type math & science using our equation keyboard — or speak equations by voice.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <ArrowLeftRight className="w-6 h-6" />,
            title: "Compare Assessments",
            description:
                "Compare results across Assessments to track progress and spot knowledge gaps.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <Languages className="w-6 h-6" />,
            title: "AI-based Auto Translation",
            description:
                "Translate Assessments & Surveys into multiple languages with a single click.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <Mic className="w-6 h-6" />,
            title: "Voice-based Answering",
            description:
                "Let respondents answer by voice for faster, more accessible submissions.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Summarization",
            description:
                "Condense long content into precise, multi-language summaries.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Learning Resources",
            description:
                "Organize materials and convert content into study-ready nuggets.",
            iconBgClass: "bg-orange-50",
            iconColorClass: "text-orange-600",
        },
    ];

    return (
        <SectionWrapper gradientClasses="from-orange-50 via-white to-purple-50">
            <SectionHeader
                title="Features"
                titleClassName="text-orange-600"
                description="Features designed to solve real challenges and save you valuable time"
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {features.map((f) => (
                    <HomeFeatureCard
                        key={f.title}
                        icon={f.icon}
                        title={f.title}
                        description={f.description}
                        iconBgClass={f.iconBgClass}
                        iconColorClass={f.iconColorClass}
                    />
                ))}
            </div>
        </SectionWrapper>
    );
}