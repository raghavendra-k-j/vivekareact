


import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    ResponsiveContainer
} from 'recharts';

function TopicBarChart() {
    const barData = [
        { name: 'Algebra', score: 92, assessments: 3, color: '#10B981' },
        { name: 'Geometry', score: 85, assessments: 2, color: '#3B82F6' },
        { name: 'Trigonometry', score: 75, assessments: 2, color: '#F59E0B' },
        { name: 'Calculus', score: 60, assessments: 1, color: '#EF4444' },
    ];

    return (
        <div className="bg-surface rounded-md shadow-sm border border-default p-4 mb-6">
            <h3 className="text-lg font-semibold text-default mb-4">Topic Performance</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12, fill: 'var(--bc-text-tertiary)' }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: 'var(--bc-text-tertiary)' }}
                            domain={[0, 100]} 
                        />
                        <Tooltip 
                            formatter={(value) => [`${value}%`, 'Score']}
                            labelFormatter={(label) => `Topic: ${label}`}
                            contentStyle={{
                                backgroundColor: 'var(--bc-bg-surface)',
                                border: '1px solid var(--bc-border-default)',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                            {barData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function CourseReportsInner() {
    const topicSummary = [
        { name: 'Algebra', score: 92, grade: 'A+', assessments: 3, color: '#10B981' },
        { name: 'Geometry', score: 85, grade: 'A', assessments: 2, color: '#3B82F6' },
        { name: 'Trigonometry', score: 75, grade: 'B', assessments: 2, color: '#F59E0B' },
        { name: 'Calculus', score: 60, grade: 'C', assessments: 1, color: '#EF4444' },
    ];

    return (
        <div className="space-y-4">
            {/* Topic Performance Chart */}
            <TopicBarChart />

            {/* Topic Summary */}
            <div className="bg-surface rounded-md shadow-sm border border-default p-4">
                <h3 className="text-lg font-semibold text-default mb-4">Topic Summary</h3>
                <div className="space-y-3">
                    {topicSummary.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0" 
                                    style={{ backgroundColor: topic.color }}
                                ></div>
                                <div className="min-w-0">
                                    <div className="font-medium text-default text-sm">{topic.name}</div>
                                    <div className="text-xs text-tertiary">{topic.assessments} assessment{topic.assessments !== 1 ? 's' : ''}</div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-default">{topic.score}%</div>
                                <div className="text-xs font-medium" style={{ color: topic.color }}>
                                    Grade {topic.grade}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CourseReportsPage() {
    return <CourseReportsInner />;
}