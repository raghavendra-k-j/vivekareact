// components/TopicReportsView.tsx
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { NumFmt } from "~/core/utils/NumFmt";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { useCourseReportsStore } from "../CourseDetailContext";
import { TopicReportItemVm } from "../models/TopicReportsResVm";

/* ----------------------------
   ViewMode Utility (personalized + rounded examples)
----------------------------- */
class ViewMode {
  static readonly minRadarTopics = 3;
  static readonly maxRadarTopics = 10;
  static readonly minChartTopics = 2;
  static readonly maxChartTopics = 10;

  id: string;
  label: string;
  helperTextTitle: string;
  helperTextMessage: string;

  constructor({
    id,
    label,
    helperTextTitle,
    helperTextMessage,
  }: {
    id: string;
    label: string;
    helperTextTitle: string;
    helperTextMessage: string;
  }) {
    this.id = id;
    this.label = label;
    this.helperTextTitle = helperTextTitle;
    this.helperTextMessage = helperTextMessage;
  }

  static List = new ViewMode({
    id: "list",
    label: "List",
    helperTextTitle: "How to understand this list?",
    helperTextMessage:
      "The list below shows all the topics in this course. For each topic, you’ll see how many items you’ve completed out of the total, and the average percentage you’ve achieved in that topic. Example: “5 of 10 items — average 75%” means you’ve completed 5 out of 10 items and your average score there is 75%. Use this view to quickly spot where completion is low or scores are dipping.",
  });

  static Chart = new ViewMode({
    id: "chart",
    label: "Chart",
    helperTextTitle: "How to read this chart?",
    helperTextMessage:
      "The chart below shows the average percentage for each topic so you can compare them side by side. Higher values mean higher average scores. Example: “80% vs 60%” means one topic averages 80% while another averages 60%, so the 80% topic is performing better. Use this view to see your strongest and weakest topics at a glance.",
  });

  static Radar = new ViewMode({
    id: "radar",
    label: "Radar",
    helperTextTitle: "How to read this radar chart?",
    helperTextMessage:
      "This view shows two numbers per topic: your average percentage and your completion rate. Seeing both together helps you judge the balance between how well you’re scoring and how much you’ve finished. Examples: “Avg 80%, Completion 40%” means you’re scoring well but many items remain; “Avg 50%, Completion 90%” means most items are done but scores are low. Use this view to decide what to focus on next.",
  });

  isEligible(count: number): boolean {
    if (this === ViewMode.Radar) {
      return count >= ViewMode.minRadarTopics && count <= ViewMode.maxRadarTopics;
    }
    if (this === ViewMode.Chart) {
      return count >= ViewMode.minChartTopics && count <= ViewMode.maxChartTopics;
    }
    return true;
  }

  requirementMessage(): string {
    if (this === ViewMode.Radar) {
      return `Radar works with ${ViewMode.minRadarTopics}–${ViewMode.maxRadarTopics} topics.`;
    }
    if (this === ViewMode.Chart) {
      return `Column chart works with ${ViewMode.minChartTopics}–${ViewMode.maxChartTopics} topics.`;
    }
    return "";
  }
}

/* ----------------------------
   Main Component
----------------------------- */
export function TopicReportsView() {
  const store = useCourseReportsStore();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.List);

  return (
    <div className="bg-white border border-default rounded-sm shadow-sm">
      <TopicReportsHeader viewMode={viewMode} onViewModeChange={setViewMode} />
      <ChartHelp title={viewMode.helperTextTitle} message={viewMode.helperTextMessage} />
      <Observer>
        {() => {
          if (store.topicReportsLoadState.isData) {
            const items = store.items;
            if (!viewMode.isEligible(items.length)) {
              return <UnsupportedViewMessage viewMode={viewMode} count={items.length} />;
            }
            if (viewMode === ViewMode.List) return <TopicReportsListView />;
            if (viewMode === ViewMode.Chart) return <TopicReportsChartView />;
            return <TopicReportsRadarView />;
          }
          if (store.topicReportsLoadState.isError) {
            const appError = store.topicReportsLoadState.error!;
            return (
              <div className="p-6">
                <SimpleRetryableAppView
                  appError={appError}
                  onRetry={() => store.loadTopicReports()}
                />
              </div>
            );
          }
          return <div className="p-6 text-secondary">Loading reports...</div>;
        }}
      </Observer>
    </div>
  );
}

/* ----------------------------
   Header + Toggle
----------------------------- */
function TopicReportsHeader({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="px-4 py-3 border-b border-tertiary">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-strong font-semibold">Topic Reports</h2>
        <TopicReportsViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>
    </div>
  );
}

function TopicReportsViewToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const options = [ViewMode.List, ViewMode.Chart, ViewMode.Radar];
  return (
    <div className="inline-flex bg-gray-100 rounded-md p-1">
      {options.map((o, i) => {
        const active = viewMode === o;
        return (
          <button
            key={o.id}
            onClick={() => onViewModeChange(o)}
            aria-pressed={active}
            className={[
              "px-3 py-1.5 text-sm font-medium rounded",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500",
              active ? "bg-white text-strong shadow-sm" : "text-secondary hover:text-default",
              i === 0 ? "rounded-l" : "",
              i === options.length - 1 ? "rounded-r" : "",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------
   Chart Helper (Collapsible)
----------------------------- */
function ChartHelp({ title, message }: { title: string; message: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4 py-2 border-b border-tertiary bg-gray-50">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-default">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-secondary" /> : <ChevronDown className="w-4 h-4 text-secondary" />}
      </button>
      {open && <div className="mt-2 text-sm text-secondary leading-relaxed">{message}</div>}
    </div>
  );
}

/* ----------------------------
   Views
----------------------------- */
function TopicReportsListView() {
  const store = useCourseReportsStore();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm" aria-label="Topic reports (hybrid view)">
        <thead className="bg-gray-50 border-b border-tertiary">
          <tr>
            <th className="text-left py-2.5 px-3 text-secondary font-medium">Topic</th>
            <th className="text-right py-2.5 px-3 text-secondary font-medium">Average Percentage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-default">
          {store.items.map((item) => (
            <TopicItemRow key={item.base.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopicItemRow({ item }: { item: TopicReportItemVm }) {
  const { name, completedCount, totalItems, averagePercentage, avatarColor } = item.base;
  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-3 align-middle">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium shrink-0"
            style={{ backgroundColor: avatarColor.bgColor, color: avatarColor.fgColor }}
            aria-hidden
          >
            {name[0]}
          </div>
          <div className="min-w-0">
            <div className="text-strong font-medium truncate">{name}</div>
            <div className="text-xs text-secondary mt-0.5 truncate">
              {completedCount} out of {totalItems} items completed
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-right align-middle whitespace-nowrap">
        <span className="text-base font-semibold text-strong">
          {NumFmt.roundToStr(averagePercentage, 0)}%
        </span>
      </td>
    </tr>
  );
}

function TopicReportsChartView() {
  const store = useCourseReportsStore();
  const data = store.items.map((it) => ({
    name: it.base.name,
    average: it.base.averagePercentage,
    color: it.base.avatarColor.bgColor,
  }));

  return (
    <div className="p-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
            <ReTooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
              formatter={(v: number) => [`${NumFmt.roundToStr(v, 0)}%`, "Average Percentage"]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="average" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded mr-2" />
          <span className="text-secondary">Average Percentage %</span>
        </div>
      </div>
    </div>
  );
}

function TopicReportsRadarView() {
  const store = useCourseReportsStore();
  const data = store.items.map((it) => ({
    topic: it.base.name.length > 12 ? it.base.name.slice(0, 12) + "…" : it.base.name,
    fullName: it.base.name,
    average: it.base.averagePercentage,
    completion: it.base.completionPercentage,
  }));

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="h-96 w-full max-w-lg">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid gridType="polygon" stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="topic" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} />
            <Radar name="Average Percentage" dataKey="average" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
            <Radar name="Completion Percentage" dataKey="completion" stroke="#10b981" fill="#10b981" fillOpacity={0.18} />
            <ReTooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
              formatter={(v: number, n: string) => [`${NumFmt.roundToStr(v, 0)}%`, n]}
              labelFormatter={(label: string) => {
                const it = data.find((d) => d.topic === label);
                return it?.fullName || label;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
          <span className="text-secondary">Average Percentage %</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2" />
          <span className="text-secondary">Completion Percentage %</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------
   Helpers
----------------------------- */
function UnsupportedViewMessage({ viewMode, count }: { viewMode: ViewMode; count: number }) {
  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="text-strong font-semibold text-lg mb-2">View Not Supported</h3>
        <p className="text-secondary text-sm mb-3">{viewMode.requirementMessage()}</p>
        <div className="text-tertiary text-xs">You currently have {count} topics.</div>
      </div>
    </div>
  );
}
