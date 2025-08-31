import React from "react";
import { observer } from "mobx-react-lite";
import { QuestionHeaderView } from "./QuestionHeaderView";
import { QuestionCardView } from "./QuestionCardView";
import { MdQRenderer } from "~/ui/components/form/commons/questionmarkit";
import { FSelect } from "~/ui/widgets/form/input/FSelect";
import { PairMatchQuestionVm } from "../models/PairMatchQuestionVm";
import { GroupQuestionVm } from "../models/GroupQuestionVm";

interface Props {
    vm: PairMatchQuestionVm;
    parentVm?: GroupQuestionVm;
}

export const PairMatchQuestionView: React.FC<Props> = observer(({ vm, parentVm }) => {
    return (
        <QuestionCardView parent={parentVm}>
            <QuestionHeaderView vm={vm} parentVm={parentVm} />
            <PairMatchTable vm={vm} />
        </QuestionCardView>
    );
});

const PairMatchTable: React.FC<{ vm: PairMatchQuestionVm }> = observer(({ vm }) => {
    return (
        <div className="mt-4">
            {/* Header (visible on larger screens) */}
            <div className="hidden sm:flex bg-slate-50 text-sm font-semibold text-default px-3 py-2">
                <div className="w-1/2">Column A</div>
                <div className="w-1/2">Column B</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-default border border-default">
                {vm.items.map((_, index) => (
                    <PairMatchRow key={vm.items[index].rowId} vm={vm} index={index} />
                ))}
            </div>
        </div>
    );
});

const PairMatchRow: React.FC<{ vm: PairMatchQuestionVm; index: number }> = observer(({ vm, index }) => {
    const item = vm.items[index];
    return (
        <div className="flex flex-col sm:flex-row gap-3 p-3">
            <div className="sm:w-1/2">
                <div
                    className="text-default"
                    dangerouslySetInnerHTML={{
                        __html: MdQRenderer.pairMatchText(item.colAText),
                    }}
                />
            </div>
            <div className="sm:w-1/2">
                <PairMatchSelect vm={vm} index={index} />
            </div>
        </div>
    );
});

const PairMatchSelect: React.FC<{ vm: PairMatchQuestionVm; index: number }> = observer(({ vm, index }) => {
    const item = vm.items[index];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        vm.setSelectedRowIdForItem(index, value ? Number(value) : null);
    };

    return (
        <div className="flex flex-col gap-1">
            <div
                className="text-secondary"
                dangerouslySetInnerHTML={{
                    __html: MdQRenderer.pairMatchText(item.colBText),
                }}
            />
            <FSelect
                className="w-full"
                value={item.selectedRowId ?? ""}
                onChange={handleChange}
            >
                <option value="">Select Correct Match</option>
                {vm.items.map((option) => (
                    <option key={option.rowId} value={option.rowId}>
                        {option.colBText}
                    </option>
                ))}
            </FSelect>
        </div>
    );
});
