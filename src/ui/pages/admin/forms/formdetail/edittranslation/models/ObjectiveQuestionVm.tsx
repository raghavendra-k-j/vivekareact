import React from "react";
import { StrUtils } from "~/core/utils/StrUtils";
import { FormTranslationQuestion } from "~/domain/forms/admin/models/translation/FormTranslationQuestion";
import { FormQuestionConst } from "~/domain/forms/const/FormQuestionConst";
import {
    Answer,
    CheckBoxesAnswer,
    MultipleChoiceAnswer,
    TrueFalseAnswer
} from "~/domain/forms/models/answer/Answer";
import {
    CheckBoxesQExtras,
    Choice,
    MultipleChoiceQExtras,
    QExtras,
    TrueFalseQExtras
} from "~/domain/forms/models/question/QExtras";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { FValue } from "~/ui/widgets/form/FValue";
import { ObjectiveQuestionView } from "../comp/ObjectiveQuestionView";
import { EditTranslationStore } from "../EditTranslationStore";
import { QuestionVm, QuestionVmProps } from "./QuestionVm";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";


export type ObjectiveQuestionVmProps = QuestionVmProps & {

}

export type CreateObjectiveQuestionVmProps = {
    question: FormTranslationQuestion;
    storeRef: EditTranslationStore;
};

export class ObjectiveQuestionVm extends QuestionVm {
    readonly choices: ChoiceItemVm[];

    constructor(props: ObjectiveQuestionVmProps) {
        super(props);
        this.choices = this.buildChoices(props.question);
    }

    private buildChoices(question: FormTranslationQuestion): ChoiceItemVm[] {
        const answer = question.answer;

        if (question.type.isMultipleChoice) {
            const { choices } = question.qExtras as MultipleChoiceQExtras;
            const selectedId = (answer as MultipleChoiceAnswer)?.id;
            return choices.map((choice) => {
                return ChoiceItemVm.fromText(
                    choice.id, choice.text,
                    choice.id === selectedId,
                    false,
                    "Choice " + choice.id,
                    "Enter choice " + choice.id + " text",
                    "Choice " + choice.id
                );
            });
        }

        if (question.type.isCheckBoxes) {
            const { choices } = question.qExtras as CheckBoxesQExtras;
            const selectedIds = new Set((answer as CheckBoxesAnswer)?.ids ?? []);
            return choices.map((choice) => {
                const isCorrect = selectedIds.has(choice.id) ? true : selectedIds.size > 0 ? false : null;
                return ChoiceItemVm.fromText(
                    choice.id, choice.text,
                    isCorrect, true,
                    "Choice " + choice.id,
                    "Enter choice " + choice.id + " text",
                    "Choice " + choice.id
                );
            });
        }

        if (question.type.isTrueFalse) {
            const { trueLabel, falseLabel } = question.qExtras as TrueFalseQExtras;
            const answerValue = (answer as TrueFalseAnswer)?.value ?? null;
            return [
                ChoiceItemVm.fromText(
                    1, trueLabel,
                    answerValue === true, false,
                    "True Label",
                    "Enter true label text",
                    "True Label"
                ),
                ChoiceItemVm.fromText(
                    2, falseLabel, answerValue === false, false,
                    "False Label",
                    "Enter false label text",
                    "False Label"
                )
            ];
        }

        throw new Error("Unsupported question type for ObjectiveQuestionVm");
    }

    public validateAndGetQExtras(): QExtras | null | false {
        // Sync all choice values
        this.choices.forEach((choice) => choice.updateValue());

        // Validate choices
        const choicesHasError = this.choices.some((choice) => choice.value.error);
        if (choicesHasError) return false;

        if (this.type.isMultipleChoice || this.type.isCheckBoxes) {
            const choices = this.choices.map((c) => c.toChoice());
            if (this.type.isMultipleChoice) {
                return new MultipleChoiceQExtras({ choices });
            }
            return new CheckBoxesQExtras({ choices });
        }

        if (this.type.isTrueFalse) {
            const trueChoiceText = this.choices[0].toLabel();
            const falseChoiceText = this.choices[1].toLabel();
            return new TrueFalseQExtras({
                trueLabel: trueChoiceText,
                falseLabel: falseChoiceText
            });
        }

        return null;
    }

    public validateAndGetAnswer(): Answer | null | false {
        return this.answer;
    }

    static create(props: CreateObjectiveQuestionVmProps): ObjectiveQuestionVm {
        return new ObjectiveQuestionVm({
            storeRef: props.storeRef,
            question: props.question
        });
    }

    render(): React.ReactNode {
        return <ObjectiveQuestionView vm={this} />;
    }
}

export type ChoiceItemVmProps = {
    id: number;
    value: FormsComposerDoc;
    isCorrect: boolean | null;
    isMultiSelect: boolean;
    label: string;
    placeholder: string;
    errorFieldName: string;
};

export class ChoiceItemVm {
    readonly id: number;
    readonly value: FValue<FormsComposerDoc | null>;
    readonly ref = React.createRef<FormsComposerEditorRef | null>();
    readonly isCorrect: boolean | null;
    readonly isMultiSelect: boolean;
    readonly label: string;
    readonly placeholder: string;
    readonly errorFieldName: string;

    constructor(props: ChoiceItemVmProps) {
        this.id = props.id;
        this.isCorrect = props.isCorrect;
        this.isMultiSelect = props.isMultiSelect;
        this.placeholder = props.placeholder;
        this.label = props.label;
        this.errorFieldName = props.errorFieldName;


        this.value = new FValue<FormsComposerDoc | null>(props.value, {
            validator: (val) => {
                let text = FormsComposerUtil.toText({
                    doc: val,
                    schema: inlineSchema
                });
                text = StrUtils.trimToNull(text);
                if (text === null) {
                    return `${this.errorFieldName} cannot be empty`;
                }
                if(text.length > FormQuestionConst.maxChoicesTextLength) {
                    return `${this.errorFieldName} cannot exceed ${FormQuestionConst.maxChoicesTextLength} characters`;
                }
                return null;
            }
        });
    }

    static fromText(id: number, text: string, isCorrect:
        boolean | null, isMultiSelect: boolean,
        label: string, placeholder: string,
        errorFieldName: string,
    ): ChoiceItemVm {
        const value = FormsComposerUtil.toNodeOrEmpty({ text, schema: inlineSchema });
        return new ChoiceItemVm({
            id,
            value,
            isCorrect,
            isMultiSelect,
            label,
            placeholder,
            errorFieldName
        });
    }

    updateValue(): void {
        const content = this.ref.current?.getContent() || null;
        this.value.set(content);
    }

    toChoice(): Choice {
        const text = this.getLabelText();
        return new Choice({ id: this.id, text });
    }

    toLabel(): string {
        const text = this.getLabelText();
        return text;
    }

    public getLabelText(): string {
        return FormsComposerUtil.toTextOrEmpty({
            doc: this.value.value,
            schema: inlineSchema
        });
    }
}
