// components/ReportsSummary.tsx
import { ArrowRight, Award, PercentCircle } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "~/ui/widgets/button/Button";
import { useCourseDetailStore } from "../CourseDetailContext";
import { NumFmt } from "~/core/utils/NumFmt";
import clsx from "clsx";

export function CourseDetailReportsSummary({className}: {className?: string}) {
  const store = useCourseDetailStore();
  const course = store.courseVm;
  const showRank = course.totalItems > 0;

  return (
    <div className={clsx("bg-surface shadow-sm rounded-sm flex flex-col border border-default", className)}>
      <header className="px-4 py-3">
        <h1 className="text-strong font-semibold text-base">Course Summary</h1>
      </header>

      <CompletionCard
        percent={course.completionPercentage}
        completedItems={course.completedItems}
        totalItems={course.totalItems}
      />

      <div className="px-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            title="Average Percentage"
            value={`${NumFmt.roundToStr(course.averagePercentage, 2)}%`}
            icon={<PercentCircle size={18} />}
            iconClassName="bg-sky-50 text-sky-600"
          />
          <StatCard
            title="Rank"
            value={!showRank ? "—" : `#${course.rank}`}
            inlineSecondary={showRank ? `of ${course.totalUsers} users` : undefined}
            icon={<Award size={18} />}
            iconClassName="bg-amber-50 text-amber-600"
          />
        </div>
      </div>

      <div className="px-4 mb-4 flex justify-center sm:justify-end lg:hidden">
        <Button className="w-full sm:w-auto">
          View Detailed Reports
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function CompletionCard({
  percent,
  completedItems,
  totalItems,
}: {
  percent: number;
  completedItems: number;
  totalItems: number;
}) {
  return (
    <section className="px-4 pb-4">
      <div className="flex items-end justify-between mb-2 text-sm">
        <div className="text-default">
          Completion{" "}
          <span className="text-secondary">({NumFmt.roundToStr(percent, 2)}%)</span>
        </div>
        <div className="text-secondary">
          {completedItems}/{totalItems} Items
        </div>
      </div>

      <div
        className="relative h-2 w-full rounded-full overflow-hidden border border-gray-300 bg-gradient-to-r from-gray-200 to-gray-300"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Course completion"
      >
        <div
          className="absolute left-0 top-0 h-full transition-[width] duration-500 bg-gradient-to-r from-primary-500 to-primary-600"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  inlineSecondary,
  icon,
  iconClassName,
}: {
  title: ReactNode;
  value: ReactNode;
  inlineSecondary?: ReactNode;
  icon?: ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="border border-default rounded-sm p-3 flex items-center gap-3">
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center border border-secondary ${iconClassName || ""
          }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-secondary text-sm truncate">{title}</div>
        <div className="text-default text-base font-semibold truncate">
          {value}
          {inlineSecondary && (
            <span className="text-secondary text-sm font-normal ml-2">
              {inlineSecondary}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
