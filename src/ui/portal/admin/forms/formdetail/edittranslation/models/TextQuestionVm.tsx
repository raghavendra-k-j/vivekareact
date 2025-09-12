import React from "react";
import { StrUtils } from "~/core/utils/StrUtils";
import { FormTranslationQuestion } from "~/domain/forms/admin/models/translation/FormTranslationQuestion";
import { FormQuestionConst } from "~/domain/forms/const/FormQuestionConst";
import { Answer, TextAreaAnswer, TextBoxAnswer } from "~/domain/forms/models/answer/Answer";
import { QExtras } from "~/domain/forms/models/question/QExtras";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { TextQuestionView } from "../comp/TextQuestionView";
import { EditTranslationStore } from "../EditTranslationStore";
import { QuestionVm, QuestionVmProps } from "./QuestionVm";
import { FormsComposerFieldVm } from "./FormsComposerFieldVm";
import { blockSchema, inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";

export type TextQuestionVmProps = QuestionVmProps;

export type CreateTextQuestionVmProps = {
    question: FormTranslationQuestion;
    storeRef: EditTranslationStore;
};

export class TextQuestionVm extends QuestionVm {
    readonly answerVm: FormsComposerFieldVm | null;

    constructor(props: CreateTextQuestionVmProps) {
        super(props);
        this.answerVm = this.createAnswerField(props.question);
    }

    private createAnswerField(question: FormTranslationQuestion): FormsComposerFieldVm | null {
        const answer = question.answer;
        if (!answer) return null;

        const isTextArea = question.type.isTextArea;
        const isTextBox = question.type.isTextBox;

        if (!isTextArea && !isTextBox) {
            throw new Error("Unsupported question type for TextQuestionVm");
        }

        const schema = isTextArea ? blockSchema : inlineSchema;
        const text = isTextArea ? (answer as TextAreaAnswer).answer : (answer as TextBoxAnswer).answer;
        const ansMaxLength = isTextArea ? FormQuestionConst.textareaAnswerMaxLength : FormQuestionConst.textboxAnswerMaxLength;

        const node = FormsComposerUtil.toNodeOrEmpty({ text, schema });
        const value = new InputValue<FormsComposerDoc | null>(node, {
            validator: (val) => {
                let text = FormsComposerUtil.toText({doc: val, schema});
                text = StrUtils.trimToNull(text);
                if(text == null) {
                    return "Answer cannot be empty";
                }
                if(text.length > ansMaxLength) {
                    return `Answer cannot exceed ${ansMaxLength} characters`;
                }
                return null;
            }
        });
        const ref = React.createRef<FormsComposerEditorRef>();

        return { value, ref };
    }

    public validateAndGetQExtras(): QExtras | null | false {
        return null;
    }

    public validateAndGetAnswer(): Answer | null | false {
        return this.answer;
    }

    static create(props: CreateTextQuestionVmProps): TextQuestionVm {
        return new TextQuestionVm({
            storeRef: props.storeRef,
            question: props.question,
        });
    }

    render(): React.ReactNode {
        return <TextQuestionView vm={this} />;
    }
}
