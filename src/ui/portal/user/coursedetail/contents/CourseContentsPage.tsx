


import { Button } from "~/ui/widgets/button/Button";

function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
        case 'Easy': return 'bg-green-100 text-green-700';
        case 'Medium': return 'bg-yellow-100 text-yellow-700';
        case 'Hard': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

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
                <h3 className="text-lg font-semibold leading-tight line-clamp-2 mb-2 text-default group-hover:text-strong">
                    {assessment.title}
                </h3>

                {/* Topic and Difficulty */}
                <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                        {assessment.difficulty}
                    </span>
                    <span className="text-sm text-tertiary">{assessment.topic}</span>
                </div>

                {/* Progress Bar (for in-progress assessments) */}
                {assessment.status === 'in-progress' && (
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
                        <div><span className="font-medium">Start Date:</span> {assessment.dueDate || 'Not set'}</div>
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

function CourseContentsInner() {
    const assessments = [
        { 
            id: 1, 
            title: 'Algebra Basics', 
            questions: 20, 
            duration: 45,
            difficulty: 'Easy',
            topic: 'Algebra',
            status: 'completed',
            score: 92,
            dueDate: 'Sep 25, 2025'
        },
        { 
            id: 2, 
            title: 'Geometry Fundamentals', 
            questions: 25, 
            duration: 60,
            difficulty: 'Medium',
            topic: 'Geometry',
            status: 'completed',
            score: 88,
            dueDate: 'Sep 27, 2025'
        },
        { 
            id: 3, 
            title: 'Trigonometry Introduction', 
            questions: 15, 
            duration: 40,
            difficulty: 'Medium',
            topic: 'Trigonometry',
            status: 'in-progress',
            progress: 65,
            dueDate: 'Sep 30, 2025'
        },
        { 
            id: 4, 
            title: 'Advanced Calculus', 
            questions: 30, 
            duration: 90,
            difficulty: 'Hard',
            topic: 'Calculus',
            status: 'pending',
            dueDate: 'Oct 3, 2025'
        },
        { 
            id: 5, 
            title: 'Statistics & Probability', 
            questions: 20, 
            duration: 50,
            difficulty: 'Medium',
            topic: 'Statistics',
            status: 'pending',
            dueDate: 'Oct 5, 2025'
        },
        { 
            id: 6, 
            title: 'Linear Algebra', 
            questions: 35, 
            duration: 75,
            difficulty: 'Hard',
            topic: 'Algebra',
            status: 'locked',
            dueDate: 'Oct 8, 2025'
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {assessments.map((assessment) => (
                <AssessmentCard 
                    key={assessment.id} 
                    assessment={assessment}
                />
            ))}
        </div>
    );
}

export default function CourseContentsPage() {
    return <CourseContentsInner />;
}