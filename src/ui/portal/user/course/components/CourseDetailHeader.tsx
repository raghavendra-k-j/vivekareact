import { useCourseDetailStore } from "../CourseDetailContext";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { BookOpen, Users, ArrowLeft, Share2, CheckCircle, Clock } from "lucide-react";
import { DateFmt } from "~/core/utils/DateFmt";
import { useNavigate } from "react-router";
import { NumFmt } from "~/core/utils/NumFmt";

export function CourseDetailHeader() {
    const store = useCourseDetailStore();
    const navigate = useNavigate();
    const detail = store.courseVm;

    if (!detail) return null;

    const getStatusColor = (status: CourseStatus) => {
        if (status.isActive) {
            return "bg-emerald-100 text-emerald-800";
        } else if (status.isCompleted) {
            return "bg-blue-100 text-blue-800";
        } else {
            return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: CourseStatus) => {
        if (status.isActive) {
            return <Clock size={14} />;
        } else if (status.isCompleted) {
            return <CheckCircle size={14} />;
        } else {
            return <BookOpen size={14} />;
        }
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Bar */}
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div className="hidden sm:block text-sm text-gray-500">
                            Back to Courses
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                            <Share2 size={16} />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>

                {/* Main Header Content */}
                <div className="py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 w-fit ${getStatusColor(detail.courseStatus)}`}>
                                {getStatusIcon(detail.courseStatus)}
                                {detail.courseStatus.label}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 truncate">
                                {detail.name}
                            </h1>
                            <div className="mt-2 text-sm text-gray-500">
                                Course Code: {detail.courseCode} &bull; Created: {DateFmt.relativeTime(detail.createdAt)}
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Users size={20} className="text-gray-500" />
                                <span className="text-lg font-medium text-gray-800">{detail.totalUsers} Students</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Completion Progress</span>
                            <span className="text-sm font-bold text-emerald-600">
                                {NumFmt.roundToStr(detail.completionPercentage, 0)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${detail.completionPercentage}%` }}
                            />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                            {detail.completedItems} of {detail.totalItems} items completed
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}