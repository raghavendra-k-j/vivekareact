import React from "react";
import { FormTranslationQuestion } from "~/domain/forms/admin/models/translation/FormTranslationQuestion";
import { QuestionVm, QuestionVmProps } from "./QuestionVm";
import { EditTranslationStore } from "../EditTranslationStore";
import { QExtras } from "~/domain/forms/models/question/QExtras";
import { Answer } from "~/domain/forms/models/answer/Answer";
import { GroupQuestionView } from "../comp/GroupQuestionView";
import { QuestionVmUtil } from "./QuestionVmFactory";


export type GroupQuestionVmProps = QuestionVmProps & {

}

export type CreateGroupQuestionVmProps = {
    question: FormTranslationQuestion;
    storeRef: EditTranslationStore;
};

export class GroupQuestionVm extends QuestionVm {

    subQuestions: QuestionVm[];

    constructor(props: GroupQuestionVmProps) {
        super(props);
        this.subQuestions = [];
        for (const q of props.question.subQuestions ?? []) {
            const subQuestion = QuestionVmUtil.create({
                question: q,
                storeRef: props.storeRef
            });
            if (subQuestion) {
                this.subQuestions.push(subQuestion);
            }
        }
    }

    public validateAndGetQExtras(): QExtras | null | false {
        return null;
    }

    public validateAndGetAnswer(): Answer | null | false {
        return null;
    }

    static create(props: CreateGroupQuestionVmProps): GroupQuestionVm {
        return new GroupQuestionVm({
            storeRef: props.storeRef,
            question: props.question
        });
    }

    render(): React.ReactNode {
        return (<GroupQuestionView vm={this} />);
    }
}