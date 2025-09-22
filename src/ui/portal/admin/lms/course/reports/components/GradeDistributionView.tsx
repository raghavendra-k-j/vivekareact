import { useState } from "react";
import { Card, CardBody, CardHeader } from "~/ui/components/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Dummy data for grade distribution
const gradeDistributionData = [
    { grade: 'A+', count: 15, percentage: 15, color: '#10B981' },
    { grade: 'A', count: 25, percentage: 25, color: '#059669' },
    { grade: 'A-', count: 20, percentage: 20, color: '#047857' },
    { grade: 'B+', count: 18, percentage: 18, color: '#3B82F6' },
    { grade: 'B', count: 12, percentage: 12, color: '#2563EB' },
    { grade: 'B-', count: 5, percentage: 5, color: '#1D4ED8' },
    { grade: 'C+', count: 3, percentage: 3, color: '#F59E0B' },
    { grade: 'C', count: 2, percentage: 2, color: '#D97706' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium text-gray-900">{`Grade ${label}`}</p>
                <p className="text-sm text-gray-600">{`Students: ${payload[0].value}`}</p>
                <p className="text-sm text-gray-600">{`Percentage: ${payload[0].payload.percentage}%`}</p>
            </div>
        );
    }
    return null;
};

export function GradeDistributionView() {
    const [selectedGrade, setSelectedGrade] = useState<typeof gradeDistributionData[0] | null>(null);

    const handleBarClick = (data: any) => {
        if (data && data.activePayload && data.activePayload[0]) {
            setSelectedGrade(data.activePayload[0].payload);
        }
    };

    return (
        <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
                <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
                <p className="text-sm text-gray-600">Distribution of student grades</p>
            </CardHeader>
            <CardBody className="p-6">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={gradeDistributionData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            onClick={handleBarClick}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis
                                dataKey="grade"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="count"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                                cursor="pointer"
                            >
                                {gradeDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Selected grade details */}
                {selectedGrade && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-semibold text-blue-900">Grade {selectedGrade.grade}</h4>
                                <p className="text-sm text-blue-700">{selectedGrade.count} students ({selectedGrade.percentage}% of total)</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{selectedGrade.count}</div>
                                <div className="text-sm text-blue-600">Students</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedGrade(null)}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                            Clear selection
                        </button>
                    </div>
                )}

                {/* Summary stats */}
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{gradeDistributionData.reduce((sum, item) => sum + item.count, 0)}</p>
                        <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {Math.round((gradeDistributionData.filter(g => g.grade.startsWith('A')).reduce((sum, item) => sum + item.percentage, 0)))}%
                        </p>
                        <p className="text-sm text-gray-600">A Grades</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}