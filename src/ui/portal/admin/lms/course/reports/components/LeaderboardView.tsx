import { Card, CardBody, CardHeader } from "~/ui/components/card";
import { Badge } from "~/ui/widgets/badges/Badge";
import { UserAvatar } from "~/ui/portal/components/avatar/UserAvatar";

// Dummy data for leaderboard
const leaderboardData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", score: 95, grade: "A+", rank: 1 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", score: 92, grade: "A", rank: 2 },
    { id: 3, name: "Carol Davis", email: "carol@example.com", score: 88, grade: "A-", rank: 3 },
    { id: 4, name: "David Wilson", email: "david@example.com", score: 85, grade: "B+", rank: 4 },
    { id: 5, name: "Eva Brown", email: "eva@example.com", score: 82, grade: "B", rank: 5 },
];

export function LeaderboardView() {
    return (
        <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
                <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                <p className="text-sm text-gray-600">Students with highest scores</p>
            </CardHeader>
            <CardBody className="p-6 pt-0">
                <div className="divide-y divide-gray-100">
                    {leaderboardData.map((student) => (
                        <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            student.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                            student.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                            student.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-50 text-gray-600'
                                        }`}>
                                            {student.rank}
                                        </div>
                                    </div>
                                    <UserAvatar id={student.id} name={student.name} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="soft"
                                        color={
                                            student.grade.startsWith('A') ? 'success' :
                                            student.grade.startsWith('B') ? 'primary' :
                                            'secondary'
                                        }
                                        size="sm"
                                    >
                                        {student.grade}
                                    </Badge>
                                    <span className="text-sm font-semibold text-gray-900">{student.score}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}