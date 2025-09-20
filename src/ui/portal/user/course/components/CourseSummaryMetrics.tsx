import { useCoursePageStore } from "../CoursePageContext";

interface Props {
  compact?: boolean; // when true use tighter spacing (mobile inline usage)
  onViewDetailedReports?: () => void;
  showAction?: boolean; // display action button
  className?: string;
}

export function CourseSummaryMetrics({ compact, onViewDetailedReports, showAction, className }: Props) {
  const store = useCoursePageStore();
  const course = store.courseData;
  const completionRate = store.completionRate;
  const pendingItems = course.totalAssessments - course.completedAssessments;

  return (
    <div className={"w-full " + (className || "")}>      
      <div className={(compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4") + ""}>
        <MetricCard label="Completed" value={course.completedAssessments} color="green" />
        <MetricCard label="Pending" value={pendingItems} color="orange" />
        <MetricCard label="Completion" value={completionRate + '%'} color="blue" hideOnCompact />
        <MetricCard label="Avg Score" value={course.averageScore + '%'} color="purple" hideOnCompact />
        <MetricCard label="Rank" value={'#' + course.rank} helper={'of ' + course.totalStudents} color="indigo" hideOnCompact />
      </div>
      {showAction && onViewDetailedReports && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onViewDetailedReports}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors text-sm font-medium"
          >
            View Detailed Reports
          </button>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color, helper, hideOnCompact }: { label: string; value: any; color: string; helper?: string; hideOnCompact?: boolean; }) {
  const base = `text-center rounded-md p-2 lg:p-3 bg-${color}-50`;
  return (
    <div className={(hideOnCompact ? "hidden lg:block " : "") + base}>
      <div className={`text-sm lg:text-xl font-bold text-${color}-600`}>{value}</div>
      <div className="text-[10px] lg:text-xs text-tertiary">{label}</div>
      {helper && <div className="hidden lg:block text-[10px] text-tertiary mt-1">{helper}</div>}
    </div>
  );
}
