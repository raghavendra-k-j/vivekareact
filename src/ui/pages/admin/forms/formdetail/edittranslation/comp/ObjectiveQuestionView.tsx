import clsx from "clsx";
import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import { FaRegCircle, FaRegSquare } from "react-icons/fa";
import { FaCircleDot, FaSquareCheck } from "react-icons/fa6";
import { MdQRenderer } from "~/ui/components/form/commons/questionmarkit";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerField } from "~/ui/components/formscomposer/FormsComposerEditorField";
import { ChoiceItemVm, ObjectiveQuestionVm } from "../models/ObjectiveQuestionVm";
import { QuestionCard } from "./QuestionCard";
import { QuestionFooter } from "./QuestionFooter";
import { QuestionHeader } from "./QuestionHeader";

export type ObjectiveQuestionViewProps = {
    vm: ObjectiveQuestionVm;
};

export function ObjectiveQuestionView({ vm }: ObjectiveQuestionViewProps) {
    return (
        <QuestionCard vm={vm}>
            <QuestionHeader vm={vm} />
            <ChoicesList vm={vm} />
            <QuestionFooter vm={vm} />
        </QuestionCard>
    );
}

type ChoicesListProps = {
    vm: ObjectiveQuestionVm;
};

function ChoicesList({ vm }: ChoicesListProps) {
    return (
        <div className="my-4">
            <Observer>
                {() => (vm.isEdit ? <EditChoicesList vm={vm} /> : <ReadChoicesList vm={vm} />)}
            </Observer>
        </div>
    );
}

function EditChoicesList({ vm }: ChoicesListProps) {
    return (
        <div className="flex flex-col gap-4 px-6">
            {vm.choices.map((choice) => (
                <EditChoiceItemView
                    key={choice.id}
                    vm={vm}
                    label={choice.label}
                    placeholder={choice.placeholder}
                    choice={choice}
                />
            ))}
        </div>
    );
}

type EditChoiceItemViewProps = {
    vm: ObjectiveQuestionVm;
    label: string;
    choice: ChoiceItemVm;
    placeholder: string;
};

function EditChoiceItemView({ label, choice, placeholder, vm }: EditChoiceItemViewProps) {
    useEffect(() => {
        const changeListener = (node: FormsComposerDoc) => {
            choice.value.set(node);
        };
        choice.ref.current?.addChangeListener(changeListener);
        return () => {
            choice.ref.current?.removeChangeListener(changeListener);
        };
    }, [choice.ref, choice.value]);

    return (
        <div className="flex items-start gap-2">
            <div className="flex-1">
                <FormsComposerField
                    ref={choice.ref}
                    schema={inlineSchema}
                    label={label}
                    value={choice.value}
                    placeholder={placeholder}
                    options={vm.storeRef.inlineComposerOptions}
                />
            </div>
        </div>
    );
}

function ReadChoicesList({ vm }: ChoicesListProps) {
    return (
        <div className="flex flex-col px-4 text-base text-default">
            {vm.choices.map((choice) => (
                <ReadChoiceItemView key={choice.id} choice={choice} />
            ))}
        </div>
    );
}

type ReadChoiceItemViewProps = {
    choice: ChoiceItemVm;
};

function ReadChoiceItemView({ choice }: ReadChoiceItemViewProps) {
    const isCorrect = choice.isCorrect === true;
    const isMultiSelect = choice.isMultiSelect;

    const Icon = isMultiSelect
        ? isCorrect
            ? FaSquareCheck
            : FaRegSquare
        : isCorrect
            ? FaCircleDot
            : FaRegCircle;

    const iconColor = isCorrect ? "text-emerald-600" : "text-gray-400";

    return (
        <div
            className={clsx(
                "flex items-center gap-3 px-2 py-2",
                isCorrect && "bg-emerald-50 rounded-sm"
            )}
        >
            <Icon size={20} className={iconColor} />
            <div
                dangerouslySetInnerHTML={{
                    __html: MdQRenderer.choiceText(choice.getLabelText()),
                }}
            />
        </div>
    );
}
