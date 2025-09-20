import { useCoursePageStore } from "./CoursePageContext";

function TopicSummaryCards() {
    const courseStore = useCoursePageStore();
    const topicSummary = courseStore.topicSummary;

    return (
        <div className="bg-surface rounded-md shadow-sm border border-default">
            <h3 className="text-lg font-semibold text-default px-4 pt-4 pb-2 border-b border-gray-200 border-opacity-60">Topic Summary</h3>
            <div className="divide-y divide-gray-200 divide-opacity-60">
                {topicSummary.map((topic: any, index: number) => {
                    const totalAssessments = topic.total || topic.assessments || 1;
                    const completedAssessments = topic.completed || 0;
                    const progressPercentage = Math.round((completedAssessments / totalAssessments) * 100);

                    return (
                        <div key={index} className="px-4 py-4">
                            <div className="space-y-3">
                                {/* Topic Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                                            style={{ backgroundColor: topic.color }}
                                        ></div>
                                        <div className="font-medium text-default text-sm">{topic.name}</div>
                                    </div>
                                    <div className="text-base font-bold" style={{ color: topic.color }}>
                                        {topic.score}%
                                    </div>
                                </div>

                                {/* Progress Bar with Completion Info */}
                                <div>
                                    <div className="flex justify-between text-xs text-tertiary mb-2">
                                        <span>Progress ({completedAssessments} out of {totalAssessments} completed)</span>
                                        <span className="text-sm font-medium">{progressPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500 shadow-sm"
                                            style={{
                                                width: `${progressPercentage}%`,
                                                backgroundColor: topic.color
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function OverallStats() {
    const courseStore = useCoursePageStore();
    const course = courseStore.courseData;

    const completionRate = Math.round((course.completedAssessments / course.totalAssessments) * 100);

    return (
        <div className="bg-surface rounded-md shadow-sm border border-default p-3">
            <h3 className="text-base font-semibold text-default mb-3">Overall Progress</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center bg-gray-50 rounded-md p-2">
                    <div className="text-xl font-bold text-default">{course.completedAssessments}</div>
                    <div className="text-xs text-tertiary">Completed</div>
                    <div className="text-xs text-tertiary mt-1">of {course.totalAssessments} total</div>
                </div>
                <div className="text-center bg-gray-50 rounded-md p-2">
                    <div className="text-xl font-bold text-default">{course.averageScore}%</div>
                    <div className="text-xs text-tertiary">Average Score</div>
                </div>
            </div>
            
            {/* Rank Information */}
            <div className="text-center bg-purple-50 rounded-md p-2 mb-3">
                <div className="text-lg font-bold text-purple-600">#{course.rank}</div>
                <div className="text-xs text-tertiary">Your Rank</div>
                <div className="text-xs text-tertiary mt-1">out of {course.totalStudents} students</div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
                <div className="flex justify-between text-xs text-default mb-1">
                    <span>Course Progress</span>
                    <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export function CourseReportsView() {
    return (
        <div className="space-y-6">
            {/* Overall Stats */}
            <OverallStats />
            
            {/* Topic Summary */}
            <TopicSummaryCards />
        </div>
    );
}