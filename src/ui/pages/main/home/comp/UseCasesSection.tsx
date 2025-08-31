import { BookOpen, Building2, GraduationCap, Heart, MessageSquare, ShoppingCart, TrendingUp, Users } from "lucide-react";

interface UseCase {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const useCases: UseCase[] = [
    {
        icon: <Building2 className="w-5 h-5" />,
        title: "Employee Training",
        description: "Design tailored assessments to evaluate employee learning and measure training effectiveness.",
        color: "text-blue-600"
    },
    {
        icon: <GraduationCap className="w-5 h-5" />,
        title: "Classroom Exams",
        description: "Generate quizzes and exams from course materials for effective student evaluation.",
        color: "text-emerald-600"
    },
    {
        icon: <Heart className="w-5 h-5" />,
        title: "Healthcare Assessment",
        description: "Ensure staff compliance with latest medical guidelines and procedures.",
        color: "text-rose-600"
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: "Recruitment",
        description: "Create assessments for candidate evaluation during recruitment processes.",
        color: "text-purple-600"
    },
    {
        icon: <ShoppingCart className="w-5 h-5" />,
        title: "Product Surveys",
        description: "Gather customer feedback about products to enhance development and satisfaction.",
        color: "text-orange-600"
    },
    {
        icon: <MessageSquare className="w-5 h-5" />,
        title: "Corporate Surveys",
        description: "Collect feedback on organizational policies and initiatives from stakeholders.",
        color: "text-yellow-600"
    },
    {
        icon: <BookOpen className="w-5 h-5" />,
        title: "Customer Feedback",
        description: "Understand customer satisfaction levels to improve products and services.",
        color: "text-cyan-600"
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Market Research",
        description: "Gather insights on market trends and customer preferences for strategic decisions.",
        color: "text-indigo-600"
    }
];

export function UseCasesSection() {
    return (
        <section id="use-cases" className="py-16 bg-violet-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Use Cases
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        From education to corporate training, healthcare to market research
                    </p>
                </div>

                {/* Use Cases Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {useCases.map((useCase, index) => (
                        <UseCaseCard key={index} useCase={useCase} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface UseCaseCardProps {
    useCase: UseCase;
}

function UseCaseCard({ useCase }: UseCaseCardProps) {
    return (
        <div className="bg-surface rounded-lg p-6 border border-gray-200 shadow-md">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 ${useCase.color} mb-4`}>
                {useCase.icon}
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {useCase.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
                {useCase.description}
            </p>
        </div>
    );
}
