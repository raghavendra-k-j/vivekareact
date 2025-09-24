import { useCourseDetailStore } from "../CourseDetailContext";
import { Card, CardBody } from "~/ui/components/card";
import { Trophy, Percent, Target } from "lucide-react";
import { NumFmt } from "~/core/utils/NumFmt";

export function CoursePerformanceDashboard() {
    const store = useCourseDetailStore();
    const detail = store.courseVm;

    if (!detail) return null;

    const isHighPerformer = detail.averagePercentage >= 80;
    const isTopRanked = detail.rank <= Math.ceil(detail.totalUsers * 0.1); // Top 10%

    const metrics = [
        {
            label: "Average Score",
            value: `${NumFmt.roundToStr(detail.averagePercentage, 0)}%`,
            icon: <Percent size={20} className={isHighPerformer ? "text-emerald-600" : "text-blue-600"} />,
            bgColor: isHighPerformer ? "bg-emerald-100" : "bg-blue-100",
            description: isHighPerformer ? "Outstanding!" : "Keep improving",
        },
        {
            label: "Class Ranking",
            value: `#${detail.rank}`,
            icon: isTopRanked ? <Trophy size={20} className="text-amber-600" /> : <Target size={20} className="text-purple-600" />,
            bgColor: isTopRanked ? "bg-amber-100" : "bg-purple-100",
            description: `out of ${detail.totalUsers} students`,
        }
    ];

    return (
        <Card className="border border-default shadow-sm bg-white">
            <CardBody className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Snapshot</h3>
                <div className="space-y-4">
                    {metrics.map((metric, index) => (
                        <div key={index} className={`p-4 rounded-lg flex items-center gap-4 ${metric.bgColor}`}>
                            <div className="flex-shrink-0">
                                {metric.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-2xl font-bold text-gray-800">
                                    {metric.value}
                                </div>
                                <div className="text-sm font-medium text-gray-600">
                                    {metric.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {metric.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}