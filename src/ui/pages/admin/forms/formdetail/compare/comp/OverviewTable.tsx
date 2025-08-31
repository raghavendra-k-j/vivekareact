import { FormComparisonOverview } from "~/domain/forms/admin/models/compare/FormComparisonOverview";
import { useAdminFormCompareStore } from "../ComparePageContext";
import { NumFmt } from "~/core/utils/NumFmt";
import { TimeFmt } from "~/core/utils/TimeFmt";
import { ReactNode } from "react";
import clsx from "clsx";

type ComparisonOverviewTableProps = {
    overview: FormComparisonOverview;
};

export const ComparisonOverviewTable = ({ overview }: ComparisonOverviewTableProps) => {

    const DiffText = {
        increase: (text: string) => <span className="text-green-600 font-medium">{text}</span>,
        decrease: (text: string) => <span className="text-red-600 font-medium">{text}</span>,
        neutral: (text?: string) => <span className="text-secondary font-medium">{text ?? "-"}</span>,
    };

    const store = useAdminFormCompareStore();
    const formDetails = store.comparisionDetailsVm;

    function getPercentageDiffText() {
        const change = overview.avgPercentChange;
        if (!change) return DiffText.neutral();

        const absValue = NumFmt.roundToStr(Math.abs(change.value), 2);
        if (change.isIncrease) return DiffText.increase(`${absValue}% improved`);
        if (change.isDecrease) return DiffText.decrease(`${absValue}% reduced`);

        return DiffText.neutral("No Change");
    }

    function getAverageTimeDiffText() {
        const change = overview.avgTimeChange;
        if (!change) return DiffText.neutral();

        const formattedTime = TimeFmt.format(Math.abs(change.value));

        if (change.isDecrease) return DiffText.increase(`${formattedTime} faster`);
        if (change.isIncrease) return DiffText.decrease(`${formattedTime} slower`);

        return DiffText.neutral("No Change");
    }

    function getPassRateDiffText() {
        const change = overview.passRateChange;
        if (!change) return DiffText.neutral();

        const absValue = NumFmt.roundToStr(Math.abs(change.value), 2);

        if (change.isIncrease) return DiffText.increase(`${absValue}% higher pass rate`);
        if (change.isDecrease) return DiffText.decrease(`${absValue}% lower pass rate`);

        return DiffText.neutral("No Change");
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full datatable-bordered border-collapse">
                <thead className="datatable-head">
                    <tr>
                        <TableHeaderCell className="w-[150px]">Metric</TableHeaderCell>
                        <TableHeaderCell className="w-[150px] text-left truncate">{formDetails.formALabel}</TableHeaderCell>
                        <TableHeaderCell className="w-[150px] text-left truncate">{formDetails.formBLabel}</TableHeaderCell>
                        <TableHeaderCell className="w-[150px] text-left">Change</TableHeaderCell>
                    </tr>
                </thead>
                <tbody>
                    <ComparisonRow
                        label="Average Percentage"
                        formAValue={`${NumFmt.roundToStr(overview.formA.avgPercent, 2)}% (${NumFmt.roundToStr(overview.formA.avgMarks, 2)}/${NumFmt.roundToStr(formDetails.formA.totalMarks, 2)})`}
                        formBValue={`${NumFmt.roundToStr(overview.formB.avgPercent, 2)}% (${NumFmt.roundToStr(overview.formB.avgMarks, 2)}/${NumFmt.roundToStr(formDetails.formB.totalMarks, 2)})`}
                        diff={getPercentageDiffText()}
                    />
                    <ComparisonRow
                        label="Average Time Taken"
                        formAValue={TimeFmt.format(overview.formA.avgTime)}
                        formBValue={TimeFmt.format(overview.formB.avgTime)}
                        diff={getAverageTimeDiffText()}
                    />
                    <ComparisonRow
                        label="Pass Rate"
                        formAValue={overview.formA.passRate != null ? `${NumFmt.roundToStr(overview.formA.passRate, 2)}%` : "-"}
                        formBValue={overview.formB.passRate != null ? `${NumFmt.roundToStr(overview.formB.passRate, 2)}%` : "-"}
                        diff={getPassRateDiffText()}
                    />
                </tbody>
            </table>
        </div>
    );
};


type TableHeaderCellProps = {
    children: React.ReactNode;
    className?: string;
};

const TableHeaderCell = ({ children, className }: TableHeaderCellProps) => {
    return (
        <th className={clsx('px-3 py-2 text-sm font-semibold text-secondary uppercase text-left', className)}>
            {children}
        </th>
    );
};


type TableCellProps = {
    children: React.ReactNode;
    className?: string;
    isLabel?: boolean;
};

const TableCell = ({ children, className, isLabel }: TableCellProps) => {
    return (
        <td className={clsx(isLabel ? 'font-medium' : 'font-regular', 'px-3 py-2 text-base-m text-default', className)}>
            {children}
        </td>
    );
};

type ComparisonRowProps = {
    label: string;
    formAValue: string | number;
    formBValue: string | number;
    diff: ReactNode;
};

const ComparisonRow = (props: ComparisonRowProps) => {
    return (
        <tr>
            <TableCell isLabel>{props.label}</TableCell>
            <TableCell className="text-left">{props.formAValue}</TableCell>
            <TableCell className="text-left">{props.formBValue}</TableCell>
            <TableCell className="text-left">{props.diff}</TableCell>
        </tr>
    );
};