import clsx from "clsx";
import { NavLink } from "react-router";
import { DateFmt } from "~/core/utils/DateFmt";
import { NumFmt } from "~/core/utils/NumFmt";
import { UserStatusBadge } from "~/ui/components/form/commons/UserStatusBadge";
import { FormItemVm } from "~/ui/portal/user/formslist/models/FormsListVm";
import { getScoreColor } from "~/ui/portal/user/formslist/components/formUtils";
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
        <div className="text-center bg-gray-50 rounded-md p-2 flex flex-col justify-center">
            <div className={clsx("text-lg font-semibold", tone)}>{value}</div>
            <div className="text-xs text-tertiary">{label}</div>
        </div>
    );
}

function CardShell({ children, form }: { children: React.ReactNode; form: FormItemVm }) {
    return (
        <NavLink
            to={getFormURLByPermalink(form.base.permalink)}
            className="bg-surface rounded-md shadow-sm border border-default hover:shadow-md transition-shadow duration-200 h-full flex flex-col overflow-hidden group"
        >
            <div className="p-4 flex-1 flex flex-col">{children}</div>
        </NavLink>
    );
}

function Title({ text }: { text: string }) {
    return (
        <h3 className="text-default group-hover:text-strong text-base font-semibold leading-tight line-clamp-2 mb-2">
            {text}
        </h3>
    );
}

function TopicBadge({ name }: { name: string }) {
    return (
        <div className="max-w-full">
            <span
                title={name}
                className="inline-flex max-w-full items-center bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis"
            >
                {name}
            </span>
        </div>
    );
}

export function DatesRow({ start, end }: { start: Date; end: Date }) {
    return (
        <div className="text-sm space-y-1.5 text-secondary">
            <div>
                <span className="text-tertiary">Start:</span> {DateFmt.datetime(start)}
            </div>
            <div>
                <span className="text-tertiary">End:</span> {DateFmt.datetime(end)}
            </div>
        </div>
    );
}

export function FormCard({ form }: { form: FormItemVm }) {
    const { base } = form;
    if (!base.type.isAssessment && !base.type.isSurvey) return null;

    const resultText = base.percentage !== null ? `${NumFmt.roundToStr(base.percentage, 0)}%` : "—";

    return (
        <CardShell form={form}>
            <div className="mb-2">
                <UserStatusBadge status={base.status} size="md" />
            </div>

            <Title text={base.title} />

            <div className="mt-auto">
                <DatesRow start={base.startDate} end={base.endDate} />

                <div className="mt-4">
                    {base.type.isAssessment ? (
                        <div className="grid grid-cols-3 gap-2 items-stretch">
                            <Stat value={base.totalQuestions} label="Questions" />
                            <Stat value={base.totalMarks ? NumFmt.roundToStr(base.totalMarks, 0) : "—"} label="Marks" />
                            <Stat
                                value={resultText}
                                label="Result"
                                tone={getScoreColor({ passingMarks: base.passingMarks, gainedMarks: base.gainedMarks })}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2 items-stretch">
                            <Stat value={NumFmt.roundToStr(base.totalQuestions, 0)} label="Questions" />
                        </div>
                    )}
                </div>

                {base.topic?.name && <div className="mt-3"><TopicBadge name={base.topic.name} /></div>}
            </div>

            <div className="mt-4">
                <Button variant="outline" className="w-full" shadow="none" onClick={() => { }}>
                    {actionLabel(form)}
                </Button>
            </div>
        </CardShell>
    );
}

export function FormCardSkeleton() {
    return (
        <div className="bg-surface rounded-md shadow-sm border border-default h-full flex flex-col overflow-hidden animate-pulse">
            <div className="p-4 flex-1 flex flex-col">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="mt-auto space-y-3">
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-40" />
                        <div className="h-3 bg-gray-200 rounded w-48" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-stretch">
                        <div className="bg-gray-100 rounded-md p-2">
                            <div className="h-5 bg-gray-200 rounded w-8 mx-auto mb-1" />
                            <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
                        </div>
                        <div className="bg-gray-100 rounded-md p-2">
                            <div className="h-5 bg-gray-200 rounded w-8 mx-auto mb-1" />
                            <div className="h-3 bg-gray-200 rounded w-10 mx-auto" />
                        </div>
                        <div className="bg-gray-100 rounded-md p-2">
                            <div className="h-5 bg-gray-200 rounded w-8 mx-auto mb-1" />
                            <div className="h-3 bg-gray-200 rounded w-10 mx-auto" />
                        </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-40" />
                    <div className="w-full h-10 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}
