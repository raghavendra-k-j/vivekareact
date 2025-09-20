import clsx from "clsx";
import { NavLink } from "react-router";
import { DateFmt } from "~/core/utils/DateFmt";
import { NumFmt } from "~/core/utils/NumFmt";
import { UserStatusBadge } from "~/ui/components/form/commons/UserStatusBadge";
import { FormItemVm } from "../models/FormsListVm";
import { getScoreColor } from "./formUtils";
import { Button } from "~/ui/widgets/button/Button";
import { getFormURLByPermalink } from "~/ui/utils/formLinkUtils";

function actionLabel(item: FormItemVm) {
    if (item.base.type.isAssessment) {
        if (item.base.status.isSubmitted) return "View Result";
        if (item.base.status.isPending) return "Start Assessment";
    } else if (item.base.type.isSurvey) {
        if (item.base.status.isSubmitted) return "View Response";
        if (item.base.status.isPending) return "Start Survey";
    }
    return "View Details";
}

function Stat({
    value,
    label,
    tone = "text-default",
}: {
    value: React.ReactNode;
    label: string;
    tone?: string;
}) {
    return (
        <div className="text-center bg-gray-50 rounded-md p-1 flex flex-col justify-center">
            <div className={clsx("text-lg font-semibold", tone)}>{value}</div>
            <div className="text-xs text-tertiary">{label}</div>
        </div>
    );
}

function CardShell({ children, form }: { children: React.ReactNode, form: FormItemVm }) {
    return (
        <NavLink to={getFormURLByPermalink(form.base.permalink)} className="bg-surface rounded-md shadow-sm border border-default hover:shadow-md transition-shadow duration-200 h-full flex flex-col overflow-hidden group">
            <div className="p-4 flex-1 flex flex-col">{children}</div>
        </NavLink>
    );
}

function Title({ text }: { text: string }) {
    return (
        <h3 className="text-lg font-semibold leading-tight line-clamp-2 mb-2 text-default group-hover:text-strong">
            {text}
        </h3>
    );
}

export function DatesRow({ start, end }: { start: Date; end: Date }) {
    return (
        <div className="text-sm space-y-2 text-tertiary">
            <div><span className="font-medium">Start Date:</span> {DateFmt.datetime(start)}</div>
            <div><span className="font-medium">End Date:</span> {DateFmt.datetime(end)}</div>
        </div>
    );
}

export function FormCard({ form }: { form: FormItemVm }) {
    const { base } = form;
    const isAssessment = base.type.isAssessment;
    const isSurvey = base.type.isSurvey;

    if (!isAssessment && !isSurvey) return null;

    const resultText =
        base.percentage !== null ? `${NumFmt.roundToStr(base.percentage, 0)}%` : "—";

    return (
        <CardShell form={form}>
            <div className="mb-2">
                <UserStatusBadge status={base.status} size="md"  />
            </div>
            <Title text={base.title} />
            <div className="mt-auto">
                <DatesRow start={base.startDate} end={base.endDate} />
                <div className="mt-4">
                    {isAssessment ? (
                        <div className="grid grid-cols-3 gap-2 items-stretch">
                            <Stat value={base.totalQuestions} label="Questions" />
                            <Stat
                                value={base.totalMarks ? NumFmt.roundToStr(base.totalMarks, 0) : "—"}
                                label="Marks"
                            />
                            <Stat value={resultText} label="Result" tone={getScoreColor({ passingMarks: base.passingMarks, gainedMarks: base.gainedMarks })} />
                        </div>
                    ) : (
                        <div>
                            <Stat value={NumFmt.roundToStr(base.totalQuestions, 0)} label="Questions" />
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <Button
                    variant="outline"
                    className="w-full"
                    shadow="none"
                    onClick={() => { }}>
                    {actionLabel(form)}
                </Button>
            </div>
        </CardShell>
    );
}

export function FormCardSkeleton() {
    return (
        <div className="bg-surface rounded-xl shadow-sm border border-default h-full flex flex-col overflow-hidden animate-pulse">
            <div className="p-5 flex-1 flex flex-col">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-20 mb-2" />
                <div className="mt-auto space-y-3">
                    <div className="bg-gray-200/60 rounded-lg p-2">
                        <div className="flex items-center justify-between gap-3">
                            <div className="h-6 bg-gray-200 rounded w-20" />
                            <div className="h-4 bg-gray-200 rounded w-6" />
                            <div className="h-6 bg-gray-200 rounded w-20" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-stretch">
                        <div>
                            <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
                            <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
                        </div>
                        <div>
                            <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
                            <div className="h-3 bg-gray-200 rounded w-8 mx-auto" />
                        </div>
                        <div>
                            <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
                            <div className="h-3 bg-gray-200 rounded w-10 mx-auto" />
                        </div>
                    </div>
                    <div className="w-full h-10 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}
