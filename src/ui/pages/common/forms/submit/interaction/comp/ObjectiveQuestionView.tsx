import type { Choice } from "~/domain/forms/models/question/QExtras";
import { observer } from "mobx-react-lite";
import { QuestionHeaderView } from "./QuestionHeaderView";
import { QuestionCardView } from "./QuestionCardView";
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { FaSquareCheck, FaCircleDot } from "react-icons/fa6";
import { MdQRenderer } from "~/ui/components/form/commons/questionmarkit";
import { ObjectiveQuestionVm } from "../models/ObjectiveQuestionVm";
import { GroupQuestionVm } from "../models/GroupQuestionVm";
import clsx from "clsx";


type ObjectiveQuestionViewProps = {
    vm: ObjectiveQuestionVm;
    parentVm?: GroupQuestionVm;
};

export function ObjectiveQuestionView(props: ObjectiveQuestionViewProps) {
    return (
        <QuestionCardView parent={props.parentVm}>
            <QuestionHeaderView vm={props.vm} parentVm={props.parentVm} />
            <ChoiceList vm={props.vm} />
        </QuestionCardView>
    );
}

type ChoiceListProps = {
    vm: ObjectiveQuestionVm;
};

function ChoiceList(props: ChoiceListProps) {
    const choices = props.vm.choices;
    return (
        <div className="px-4 py-4 flex flex-col gap-1">
            {choices.map((choice) => (
                <ChoiceItem key={choice.id} vm={props.vm} choice={choice} />
            ))}
        </div>
    );
}

type ChoiceItemProps = {
    vm: ObjectiveQuestionVm;
    choice: Choice;
};

export const ChoiceItem = observer(function ChoiceItem({ vm, choice }: ChoiceItemProps) {
    const isMultipleChoice = vm.base.type.isCheckBoxes;
    const isSelected = vm.isSelected(choice);

    const handleClick = () => {
        vm.onChoiceClick(choice);
    };

    const Icon = isMultipleChoice
        ? isSelected
            ? FaSquareCheck
            : FaRegSquare
        : isSelected
            ? FaCircleDot
            : FaRegCircle;

    const iconClassName = isSelected ? 'text-primary' : 'text-tertiary';

    return (
        <button
            onClick={handleClick}
            className={`w-full text-base-m text-left text-default flex items-center gap-3 px-4 py-2 rounded-sm transition-colors duration-150 cursor-pointer 
            ${isSelected ? "bg-primary-50" : ""}`}
        >
            <Icon size={20} className={clsx(iconClassName, "shrink-0")} />
            <div dangerouslySetInnerHTML={{ __html: MdQRenderer.choiceText(choice.text) }} />
        </button>
    );
});