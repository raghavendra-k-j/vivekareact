import React from "react";
import { StrUtils } from "~/core/utils/StrUtils";
import { FormTranslationQuestion } from "~/domain/forms/admin/models/translation/FormTranslationQuestion";
import { FormQuestionConst } from "~/domain/forms/const/FormQuestionConst";
import { Answer, FillBlankInputAnswer, FillBlanksAnswer } from "~/domain/forms/models/answer/Answer";
import { FillBlanksQExtras, QExtras } from "~/domain/forms/models/question/QExtras";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { FillBlankQuestionView } from "../comp/FillBlankQuestionView";
import { EditTranslationStore } from "../EditTranslationStore";
import { QuestionVm, QuestionVmProps } from "./QuestionVm";
import { FormsComposerFieldVm } from "./FormsComposerFieldVm";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";

export type FillBlankQuestionVmProps = QuestionVmProps;

export type CreateFillBlankQuestionVmProps = {
    question: FormTranslationQuestion;
    storeRef: EditTranslationStore;
};

export class FillBlankQuestionVm extends QuestionVm {
    readonly items: FillBlankItemVm[];

    constructor(props: FillBlankQuestionVmProps) {
        super(props);
        this.items = this.createItems(props.question);
    }

    private createItems(question: FormTranslationQuestion): FillBlankItemVm[] {
        if (!question.type.isFillBlank) {
            throw new Error("Unsupported question type for FillBlankQuestionVm");
        }

        const qExtras = question.qExtras as FillBlanksQExtras | null;
        const answer = question.answer as FillBlanksAnswer | null;
        if (!qExtras || !qExtras.inputs) return [];

        const answerMap = answer?.toIdMap() ?? {};

        return qExtras.inputs.map((input) => {
            const answerText = answerMap[input.id] ?? "";
            return FillBlankItemVm.fromText(input.id, answerText);
        });
    }

    public validateAndGetQExtras(): QExtras | null | false {
        return this.qExtras;
    }

    public validateAndGetAnswer(): Answer | null | false {
        const answerItems: FillBlankInputAnswer[] = [];
        for (const item of this.items) {
            if (item.hasError) {
                return false;
            }
            const value = item.editorVm.value.value;
            const text = FormsComposerUtil.toText({
                doc: value,
                schema: inlineSchema,
            });
            const trimmedText = StrUtils.trimToNull(text)!;
            const fillBlankInputAnswer = new FillBlankInputAnswer({
                id: item.id,
                answer: trimmedText,
            });
            answerItems.push(fillBlankInputAnswer);
        }
        return new FillBlanksAnswer({
            answers: answerItems,
        });
    }

    static create(props: CreateFillBlankQuestionVmProps): FillBlankQuestionVm {
        return new FillBlankQuestionVm({
            storeRef: props.storeRef,
            question: props.question,
        });
    }

    render(): React.ReactNode {
        return <FillBlankQuestionView vm={this} />;
    }
}

export type FillBlankItemVmProps = {
    id: number;
    value: FormsComposerDoc;
};

export class FillBlankItemVm {
    readonly id: number;
    readonly editorVm: FormsComposerFieldVm;

    get hasError(): boolean {
        return this.editorVm.value.hasError;
    }


    constructor(props: FillBlankItemVmProps) {
        const value = new InputValue<FormsComposerDoc | null>(props.value, {
            validator: (val) => {
                let text = FormsComposerUtil.toText({
                    doc: val,
                    schema: inlineSchema,
                });
                text = StrUtils.trimToNull(text);

                const label = `Fill up ${props.id} answer`;

                if (text === null) {
                    return `${label} cannot be empty.`;
                }
                if (text.length > FormQuestionConst.fillBlanksAnswerMaxLength) {
                    return `Fill up ${props.id} answer must not exceed ${FormQuestionConst.fillBlanksAnswerMaxLength} characters.`;
                }
                return null;
            }
        });
        const ref = React.createRef<FormsComposerEditorRef>();
        this.id = props.id;
        this.editorVm = { value, ref };
    }

    static fromText(id: number, text: string): FillBlankItemVm {
        const value = FormsComposerUtil.toNodeOrEmpty({ text, schema: inlineSchema });
        return new FillBlankItemVm({ id, value });
    }
}
