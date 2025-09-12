import { GroupQuestionVm } from "../models/GroupQuestionVm";
import { Fragment } from "react";
import { QuestionCard } from "./QuestionCard";
import { QuestionHeader } from "./QuestionHeader";

export type GroupQuestionViewProps = {
    vm: GroupQuestionVm;
};

export function GroupQuestionView({ vm }: GroupQuestionViewProps) {
    return (
        <QuestionCard vm={vm}>
            <QuestionHeader vm={vm} />
            <div className="mt-4 flex flex-col divide-y divide-default border-t border-default">
                {vm.subQuestions.map((q) => (<Fragment key={q.id}>{q.render()}</Fragment>))}
            </div>
        </QuestionCard>
    );
}