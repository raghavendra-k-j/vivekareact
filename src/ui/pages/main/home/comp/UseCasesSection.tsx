import {
    BookOpen,
    Building2,
    GraduationCap,
    Heart,
    MessageSquare,
    ShoppingCart,
    TrendingUp,
    Users,
} from "lucide-react";
import { HomeFeatureCard, SectionHeader } from "./CoreSection";

export function UseCasesSection() {
    const useCases = [
        {
            icon: <Building2 className="w-5 h-5" />,
            title: "Customized Employee Training Assessments",
            description:
                "Design tailored assessments and surveys to evaluate employee learning and development. Identify knowledge gaps and measure training effectiveness using detailed analytics.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            icon: <GraduationCap className="w-5 h-5" />,
            title: "Classroom Quizzes and Exams",
            description:
                "Generate quizzes and exams from course materials, tailored to different learning levels. Save time and ensure a diverse set of questions for effective student evaluation.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            icon: <Heart className="w-5 h-5" />,
            title: "Staff Knowledge Assessment in Healthcare",
            description:
                "Develop assessments to ensure healthcare staff are up-to-date with the latest medical guidelines and procedures. Monitor compliance and identify training needs through detailed reports.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Recruitment Assessments",
            description:
                "Create assessments for candidate evaluation during recruitment processes. Improve hiring decisions and ensure a thorough evaluation of candidates' qualifications.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            icon: <ShoppingCart className="w-5 h-5" />,
            title: "Product Surveys",
            description:
                "Conduct surveys to gather feedback and insights from customers about your products or services. Analyze responses to enhance product development and customer satisfaction.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            icon: <MessageSquare className="w-5 h-5" />,
            title: "Corporate Surveys",
            description:
                "Create surveys to collect feedback from employees or stakeholders on organizational policies, initiatives, or events. Gain insights to improve corporate culture and decision-making.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            title: "Customer Feedback",
            description:
                "Collect feedback from customers to understand their satisfaction levels and improve products or services accordingly. Enhance customer retention and loyalty through actionable insights.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            title: "Market Research Surveys",
            description:
                "Conduct comprehensive surveys to gather insights on market trends, customer preferences, and competitive landscape. Analyze survey data to make informed business decisions and strategize effectively in dynamic markets.",
            iconBgClass: "bg-purple-50",
            iconColorClass: "text-purple-600",
        },
    ];

    return (
        <section id="use-cases" className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-violet-50" />
            <div className="relative container px-4 py-16">
                <SectionHeader title="Use Case" titleClassName="text-purple-600" />
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {useCases.map((u) => (
                        <HomeFeatureCard
                            key={u.title}
                            icon={u.icon}
                            title={u.title}
                            description={u.description}
                            iconBgClass={u.iconBgClass}
                            iconColorClass={u.iconColorClass}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
