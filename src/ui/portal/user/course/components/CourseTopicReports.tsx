import { Card, CardBody } from "~/ui/components/card";
import { PieChart, TrendingUp, TrendingDown } from "lucide-react";

type TopicData = {
    name: string;
    score: number;
    trend: number; // positive or negative percentage
};

export function CourseTopicReports() {
    // Mock data - in real app this would come from the reports store
    const topics: TopicData[] = [
        { name: "React Fundamentals", score: 85, trend: 5 },
        { name: "State Management", score: 78, trend: -2 },
        { name: "Component Patterns", score: 92, trend: 8 },
        { name: "Hooks & Effects", score: 76, trend: 3 },
        { name: "Performance", score: 88, trend: 6 },
        { name: "Testing", score: 82, trend: -1 },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-600";
        if (score >= 80) return "text-blue-600";
        if (score >= 70) return "text-amber-600";
        return "text-red-600";
    };
    
    const getTrendIcon = (trend: number) => {
        return trend >= 0 
            ? <TrendingUp size={16} className="text-emerald-600" /> 
            : <TrendingDown size={16} className="text-red-600" />;
    }

    return (
        <Card className="border border-default shadow-sm bg-white">
            <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <PieChart size={20} className="text-gray-700" />
                    <h3 className="text-lg font-bold text-gray-900">Topic-wise Report</h3>
                </div>
                <ul className="space-y-3">
                    {topics.map((topic, index) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{topic.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {getTrendIcon(topic.trend)}
                                    <span className={`text-sm font-medium ${topic.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {Math.abs(topic.trend)}%
                                    </span>
                                </div>
                                <div className={`text-base font-bold ${getScoreColor(topic.score)}`}>
                                    {topic.score}%
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
}