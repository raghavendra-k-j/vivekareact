import { BarChart3, BookOpen, FileText, Zap } from "lucide-react";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const features: Feature[] = [
    {
        icon: <Zap className="w-6 h-6" />,
        title: "AI-Powered Assessment Generation",
        description: "Transform any document into customized assessments and surveys effortlessly. Upload documents or paste content and watch AI generate tailored questions.",
        color: "text-blue-600"
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Detailed User Analytics",
        description: "Deep insights into user engagement and performance with comprehensive analytics. Monitor response rates, trends, scores, and detailed performance insights.",
        color: "text-emerald-600"
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: "Document Summarization",
        description: "Effortlessly summarize documents in multiple languages. Receive concise summaries highlighting key points for quick understanding of lengthy documents.",
        color: "text-purple-600"
    },
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: "Learning Resources Management",
        description: "Organize and access a comprehensive library of learning resources. Interact with content, summarize information, and enhance learning experiences.",
        color: "text-orange-600"
    }
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-16 bg-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Comprehensive tools for modern assessment creation, document summarization and analytics
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface FeatureCardProps {
    feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
    return (
        <div className="text-center bg-surface shadow-md rounded-md p-4">
            {/* Icon Container */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 ${feature.color} mb-4`}>
                {feature.icon}
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
            </p>
        </div>
    );
}
