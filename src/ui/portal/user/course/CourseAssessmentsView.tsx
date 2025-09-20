import { Button } from "~/ui/widgets/button/Button";
import { useCoursePageStore } from "./CoursePageContext";



function getStatusBadgeClass(status: string) {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-700';
        case 'in-progress': return 'bg-blue-100 text-blue-700';
        case 'locked': return 'bg-gray-100 text-gray-600';
        default: return 'bg-gray-100 text-gray-700';
    }
}

function getActionLabel(status: string) {
    switch (status) {
        case 'completed': return 'View Results';
        case 'in-progress': return 'Continue';
        case 'locked': return 'Locked';
        default: return 'Start Assessment';
    }
}

function Stat({
    value,
    label,
}: {
    value: React.ReactNode;
    label: string;
}) {
    return (
        <div className="text-center bg-gray-50 rounded-md p-1 flex flex-col justify-center">
            <div className="text-lg font-semibold text-default">{value}</div>
            <div className="text-xs text-tertiary">{label}</div>
        </div>
    );
}

function AssessmentCard({ assessment }: { assessment: any }) {
    return (
        <div className="bg-surface rounded-md shadow-sm border border-default hover:shadow-md transition-shadow duration-200 h-full flex flex-col overflow-hidden group">
            <div className="p-4 flex-1 flex flex-col">
                {/* Status Badge */}
                <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(assessment.status)}`}>
                        {assessment.status === 'completed' ? 'Completed' : 
                         assessment.status === 'in-progress' ? 'In Progress' :
                         assessment.status === 'locked' ? 'Locked' : 'Pending'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold leading-tight line-clamp-2 mb-2 text-default group-hover:text-strong">
                    {assessment.title}
                </h3>

                {/* Topic Only */}
                <div className="mb-3">
                    <span className="text-sm text-tertiary">{assessment.topic}</span>
                </div>

                {/* Progress Bar (for in-progress assessments) */}
                {assessment.status === 'in-progress' && assessment.progress && (
                    <div className="mb-3">
                        <div className="flex justify-between text-xs text-tertiary mb-1">
                            <span>Progress</span>
                            <span>{assessment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${assessment.progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Stats and Action Button - Following FormCard pattern */}
                <div className="mt-auto">
                    <div className="text-sm space-y-2 text-tertiary mb-4">
                        <div><span className="font-medium">Due Date:</span> {assessment.dueDate}</div>
                        <div><span className="font-medium">Duration:</span> {assessment.duration} minutes</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 items-stretch mb-4">
                        <Stat value={assessment.questions} label="Questions" />
                        <Stat value={assessment.duration + 'm'} label="Time" />
                        <Stat value={assessment.score ? `${assessment.score}%` : '—'} label="Score" />
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        shadow="none"
                        disabled={assessment.status === 'locked'}
                    >
                        {getActionLabel(assessment.status)}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function CourseAssessmentsView() {
    const courseStore = useCoursePageStore();
    const assessments = courseStore.assessments;

    return (
        <div className="space-y-4">
            {/* Assessment Grid - Optimized for 8-column layout */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {assessments.map((assessment: any) => (
                    <AssessmentCard 
                        key={assessment.id} 
                        assessment={assessment}
                    />
                ))}
            </div>
        </div>
    );
}