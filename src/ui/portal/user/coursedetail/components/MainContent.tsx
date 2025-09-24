// components/MainContent.tsx
import { ChevronDown } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import ResponsiveView from "~/ui/widgets/responsive";
import { useCourseDetailStore } from "../CourseDetailContext";
import { ContentsListView } from "./ContentsListView";
import { CourseDetailReportsSummary } from "./ReportsSummary";
import { TopicReportsView } from "./TopicReportsView";

export function CourseDetailMainContent() {
  const store = useCourseDetailStore();
  return (
    <Observer>
      {() => {
        if (store.loadState.isData) {
          return <MainContent />;
        } else if (store.loadState.isError) {
          const appError = store.loadState.error!;
          return (
            <FullCenteredView>
              <SimpleRetryableAppView
                className="p-6"
                appError={appError}
                onRetry={() => store.loadCourseDetail()}
              />
            </FullCenteredView>
          );
        }
        return (
          <FullCenteredView className="p-6">
            <LoaderView />
          </FullCenteredView>
        );
      }}
    </Observer>
  );
}

function MainContent() {
  return (
    <ResponsiveView
      mobile={<MobileMainContentView />}
      desktop={<DesktopMainContentView />}
    />
  );
}

function MobileMainContentView() {
  return (
    <div className="h-full flex flex-col flex-1 min-h-0 overflow-y-auto">
      <div className="p-4">
        <CourseDetailReportsSummary />
      </div>
      <div className="p-4">
        <ContentsListView />
      </div>
    </div>
  );
}

/** Desktop: two-column layout; right rail is scrollable and shows Summary + Reports */
function DesktopMainContentView() {
  return (
    <div className="flex flex-row flex-1 min-h-0 overflow-hidden">
      <div className="h-full flex-1 min-w-0 overflow-y-auto">
        <ContentsListView />
      </div>
      <div className="p-4 space-y-4 w-120 flex-shrink-0 h-full overflow-y-auto">
        <CourseDetailReportsSummary />
        <TopicReportsView />
      </div>
    </div>
  );
}


function MobileReportsDetail({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-4 border border-default rounded-sm bg-white">
      <MobileCourseHeader onClose={onClose} />
      <div className="p-3 pt-0">
        <TopicReportsView />
      </div>
    </div>
  );
}

function MobileCourseHeader({ onClose }: { onClose: () => void }) {
  const store = useCourseDetailStore();
  const course = store.courseVm;
  const statusStr = String(course.courseStatus);
  const active =
    statusStr.toLowerCase() === "active" || statusStr.toLowerCase() === "published";

  return (
    <div className="px-3 py-3 border-b border-tertiary flex items-center justify-between">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-strong truncate">{course.name}</div>
        <div
          className={[
            "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] mt-1",
            active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-100 text-gray-600 border-gray-200",
          ].join(" ")}
        >
          {statusStr}
        </div>
      </div>
      <button
        onClick={onClose}
        className="inline-flex items-center text-xs text-secondary hover:text-default"
      >
        Hide detailed reports
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
