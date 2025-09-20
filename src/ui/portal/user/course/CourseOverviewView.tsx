import { CourseSummaryMetrics } from "./components/CourseSummaryMetrics";
import { useCoursePageStore } from "./CoursePageContext";
import { CourseAvatar } from "~/ui/portal/components/avatar/CourseAvatar";

export function CourseOverviewView({ onViewDetailedReports }: { onViewDetailedReports?: () => void }) {
  const store = useCoursePageStore();
  const course = store.courseData;
  return (
    <div className="space-y-4">
      {/* Mobile quick metrics */}
      <div className="lg:hidden">
        <div className="bg-surface rounded-md shadow-sm border border-default p-4">
          <h3 className="text-base font-semibold text-default mb-3">Quick Summary</h3>
          <CourseSummaryMetrics compact showAction onViewDetailedReports={onViewDetailedReports} />
        </div>
      </div>

      {/* Desktop Header + metrics */}
      <div className="hidden lg:block">
        <div className="bg-surface rounded-md shadow-sm border border-default p-6">
          <div className="flex items-center gap-4 mb-6">
            <CourseAvatar name={course.name} color={course.bgColor} className="w-16 h-16" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-default mb-1">{course.name}</h2>
              <div className="text-tertiary text-sm">{course.teachers.length} teachers · {course.totalStudents} students</div>
            </div>
          </div>
          <CourseSummaryMetrics onViewDetailedReports={onViewDetailedReports} showAction />
        </div>
      </div>
    </div>
  );
}