import { NavLink } from "react-router";
import { NumFmt } from "~/core/utils/NumFmt";
import { CourseAvatar } from "~/ui/portal/components/avatar/CourseAvatar";
import { getCouseURLById } from "~/ui/utils/couseLinkUtils";
import { Button } from "~/ui/widgets/button/Button";
import { CourseItemVm } from "../models/CourseListVm";

export function CourseCard({ course }: { course: CourseItemVm }) {
    const { base } = course;
    const avatarColor = base.avatarColor;
    return (
        <NavLink to={getCouseURLById(course.base.permalink)} className="bg-surface rounded-md shadow-sm border border-default hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden">
            <div className="p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center flex-1 mr-2">
                    <CourseAvatar name={base.name} color={avatarColor.bgColor} className="mr-2 w-12 h-12" />
                    <h3 className="text-base font-semibold text-default leading-snug line-clamp-2">
                        {base.name}
                    </h3>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-secondary">
                        {NumFmt.roundToStr(base.averagePercentage, 0)}%
                    </div>
                    <div className="text-xs text-secondary">Average</div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between text-sm text-secondary mb-2">
                    <span>Progress: {NumFmt.roundToStr(base.progress, 0)}%</span>
                    <span className="whitespace-nowrap">{base.completedItems}/{base.completedItems} items</span>
                </div>

                <div
                    className="w-full rounded-full h-2 bg-gray-200"
                >
                    <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${base.progress}%`, backgroundColor: avatarColor.bgColor }}
                    />
                </div>

                <Button
                    shadow="none"
                    onClick={() => { }}
                    variant="outline"
                    className="w-full mt-5">
                    View Course
                </Button>
            </div>
        </NavLink>
    );
}

export function CourseCardSkeleton() {
    return (
        <div className="bg-surface rounded-lg shadow-sm border border-default h-full flex flex-col overflow-hidden animate-pulse">
            <div className="p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center flex-1 mr-2">
                    <div className="w-9 h-9 rounded-full bg-gray-300 mr-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="text-right">
                    <div className="h-8 bg-gray-300 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-10"></div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between text-sm mb-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>

                <div className="w-full rounded-full h-2 bg-gray-200">
                    <div className="h-2 rounded-full bg-gray-300 w-1/4"></div>
                </div>

                <div className="w-full h-10 bg-gray-300 rounded mt-5"></div>
            </div>
        </div>
    );
}
