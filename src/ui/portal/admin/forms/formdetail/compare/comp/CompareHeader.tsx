import React, { ReactNode } from "react";
import {
    FileText,
    ListChecks,
    Users,
    ShieldCheck,
    MoveUp,
} from "lucide-react";
import { AdminFormCompareStore } from "../ComparePageStore";
import { useAdminFormCompareStore } from "../ComparePageContext";
import { FormCompareDetail } from "~/domain/forms/admin/models/compare/FormCompareDetail";
import { NumFmt } from "~/core/utils/NumFmt";
import OutlinedButton from "~/ui/widgets/button/OutlinedButton";
import { DateFmt } from "~/core/utils/DateFmt";
import { FormLabelView } from "./FormLabelView";

type FormMetaItemProps = {
    icon: React.ReactNode;
    label: React.ReactNode;
    value: React.ReactNode;
};

function FormMetaItem({ icon, label, value }: FormMetaItemProps) {
    return (
        <div className="flex items-center gap-2 text-base-m">
            <span className="text-secondary w-4 h-4">{icon}</span>
            <span className="font-medium">{label}: </span>
            <span>{value}</span>
        </div>
    );
}

type ImprovementCircleProps = {
    store: AdminFormCompareStore;
};

export function ImprovementCircle({ store }: ImprovementCircleProps) {
    const overviewData = store.comparisonOverview;
    const percentChange = overviewData.avgPercentChange;
    const rawValue = percentChange.value;
    const compareFormDetails = store.compareVm.detailsVm;

    let textClass = "text-default";
    let sign = "";
    let icon: ReactNode;

    if (percentChange.isIncrease) {
        textClass = "text-emerald-600";
        sign = "+";
        icon = <MoveUp className="w-4 h-4" />;
    }
    else if (percentChange.isDecrease) {
        textClass = "text-red-600";
        sign = "–";
        icon = <MoveUp className="w-4 h-4 rotate-180" />;
    }

    return (
        <div className="p-3 relative z-10 min-w-[72px] min-h-[72px] flex flex-col justify-center items-center rounded-sm bg-surface border border-default shadow-inner text-center space-y-1">
            <p className="text-base-m font-medium text-secondary">
                {compareFormDetails.base.commonResponsesCount === 1
                    ? "1 Matching User"
                    : `${compareFormDetails.base.commonResponsesCount} Matching Users`}
            </p>
            <p className={`text-lg font-bold ${textClass}`}>
                <span className="flex items-center">{sign}{NumFmt.roundToStr(Math.abs(rawValue), 2)}% {icon}</span>
            </p>
            <p className="text-base-m text-secondary px-2">
                Avg Percentage
            </p>
        </div>
    );
}

type FormBlockProps = {
    form: FormCompareDetail;
    label: string;
    onLabelChange: (newLabel: string) => void;
};

function FormBlock(props: FormBlockProps) {
    const iconClassName = "w-full h-full";

    const metaItems = [
        {
            icon: <FileText className={iconClassName} />,
            label: "Questions",
            value: props.form.totalQuestions
        },
        {
            icon: <ListChecks className={iconClassName} />,
            label: "Marks",
            value: NumFmt.roundToStr(props.form.totalMarks, 2)
        },
        {
            icon: <ShieldCheck className={iconClassName} />,
            label: "Passing Marks",
            value: (props.form.passingMarks === undefined || props.form.passingMarks === null) ? "N/A" : NumFmt.roundToStr(props.form.passingMarks, 2)
        },
        {
            icon: <Users className={iconClassName} />,
            label: "Responses",
            value: props.form.totalResponses
        }
    ];

    return (
        <div className="flex flex-col flex-1 space-y-2">
            <FormLabelView
                label={props.label}
                onLabelChange={props.onLabelChange}
            />
            <div>
                <div className="text-base-p font-semibold text-default overflow-hidden text-ellipsis line-clamp-2">
                    {props.form.title}
                </div>
                <div className="text-sm text-secondary">Created On: {DateFmt.datetime(props.form.createdAt)}</div>
            </div>
            <div className="mt-2 text-sm text-secondary font-medium grid grid-cols-2 gap-x-4 gap-y-2">
                {metaItems.map((item, idx) => (
                    <FormMetaItem key={idx} {...item} />
                ))}
            </div>
        </div>
    );
}

export function CompareHeader() {
    const store = useAdminFormCompareStore();
    const { detailsVm } = store.compareVm;
    const { formA, formB } = detailsVm.base;

    return (
        <div className="relative flex flex-row bg-surface shadow-sm gap-4 items-stretch rounded-sm border border-secondary p-4">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 z-0" />

            {/* Form A Block */}
            <FormBlock
                form={formA}
                label={detailsVm.formALabel}
                onLabelChange={(label) => store.updateFormLabel({ label: label, isFormA: true })}
            />

            {/* Centered Column for Circle + Button */}
            <div className="flex flex-col items-center justify-center space-y-3 px-2 z-10">
                <ImprovementCircle store={store} />
                <OutlinedButton size="sm" onClick={() => store.reverseComparision()}>
                    Reverse Comparison
                </OutlinedButton>
            </div>

            {/* Form B Block */}
            <FormBlock
                form={formB}
                label={detailsVm.formBLabel}
                onLabelChange={(label) => store.updateFormLabel({ label: label, isFormA: false })}
            />
        </div>
    );
}
