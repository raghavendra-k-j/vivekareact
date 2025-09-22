import { Observer } from "mobx-react-lite";
import { Card, CardBody } from "~/ui/components/card";
import { useReportsStore } from "../ReportsContext";
import { Crown, Users, ClipboardList, FileText, Trophy } from "lucide-react";

interface OverviewCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

function OverviewCard({ title, value, icon, color }: OverviewCardProps) {
    const getBorderColor = (color: string) => {
        switch (color) {
            case 'text-blue-600': return 'border-blue-200';
            case 'text-green-600': return 'border-green-200';
            case 'text-purple-600': return 'border-purple-200';
            case 'text-orange-600': return 'border-orange-200';
            case 'text-yellow-600': return 'border-yellow-200';
            default: return 'border-gray-200';
        }
    };

    return (
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardBody className="p-4">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border ${getBorderColor(color)} flex-shrink-0`}>
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                        <p className={`text-xl font-bold ${color} leading-tight`}>{value.toLocaleString()}</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export function OverviewCards() {
    const store = useReportsStore();

    return (
        <Observer>
            {() => {
                if (store.isLoading) {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Card key={index} className="bg-white border border-gray-200 shadow-sm animate-pulse">
                                    <CardBody className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                                                <div className="h-5 bg-gray-200 rounded w-12"></div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    );
                }

                if (store.isError) {
                    return (
                        <Card className="bg-white border border-red-200 shadow-sm">
                            <CardBody className="p-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <p className="text-red-900 font-medium mb-2">Failed to load course data</p>
                                    <p className="text-sm text-red-600">{store.error?.message}</p>
                                </div>
                            </CardBody>
                        </Card>
                    );
                }

                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <OverviewCard
                            title="Total Assessments"
                            value={store.totalAssessments}
                            icon={<ClipboardList className="w-5 h-5 text-blue-600" />}
                            color="text-blue-600"
                        />
                        <OverviewCard
                            title="Total Surveys"
                            value={store.totalSurveys}
                            icon={<FileText className="w-5 h-5 text-green-600" />}
                            color="text-green-600"
                        />
                        <OverviewCard
                            title="Total Admins"
                            value={store.totalAdmins}
                            icon={<Crown className="w-5 h-5 text-purple-600" />}
                            color="text-purple-600"
                        />
                        <OverviewCard
                            title="Total Users"
                            value={store.totalUsers}
                            icon={<Users className="w-5 h-5 text-orange-600" />}
                            color="text-orange-600"
                        />
                        <OverviewCard
                            title="Topper"
                            value={98}
                            icon={<Trophy className="w-5 h-5 text-yellow-600" />}
                            color="text-yellow-600"
                        />
                    </div>
                );
            }}
        </Observer>
    );
}