import { makeObservable, observable, runInAction } from "mobx";
import React from "react";
import { FormTranslationQuestion } from "~/domain/forms/admin/models/translation/FormTranslationQuestion";
import { FormQuestionConst } from "~/domain/forms/const/FormQuestionConst";
import { Answer } from "~/domain/forms/models/answer/Answer";
import { QExtras } from "~/domain/forms/models/question/QExtras";
import { QuestionType } from "~/domain/forms/models/question/QuestionType";
import { blockSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { FValue } from "~/ui/widgets/form/FValue";
import { FValueUtil } from "~/ui/widgets/form/FValueUtil";
import { EditTranslationStore } from "../EditTranslationStore";
import { FormsComposerFieldVm } from "./FormsComposerFieldVm";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";

export type QuestionVmProps = {
    storeRef: EditTranslationStore;
    question: FormTranslationQuestion;
    parentQuestion?: FormTranslationQuestion | null;
};

export abstract class QuestionVm {
    storeRef: EditTranslationStore;
    isEdit: boolean;

    id: number;
    type: QuestionType;
    parentId: number | null;

    qNumber: number;
    subQNumber: number | null;

    question: FormsComposerFieldVm;
    ansHint: FormsComposerFieldVm;
    ansExplanation: FormsComposerFieldVm;

    qExtras: QExtras | null;
    answer: Answer | null;

    hasAnsHint: boolean = false;
    hasAnsExplanation: boolean = false;

    hasError: boolean = false;

    constructor(props: QuestionVmProps) {
        this.storeRef = props.storeRef;
        this.isEdit = false;

        this.id = props.question.id;
        this.type = props.question.type;
        this.parentId = props.question.parentId;

        if (props.parentQuestion) {
            this.qNumber = props.parentQuestion.dOrder;
            this.subQNumber = props.question.dOrder;
        }
        else {
            this.qNumber = props.question.dOrder;
            this.subQNumber = null;
        }

        this.qExtras = props.question.qExtras;
        this.answer = props.question.answer;

        this.question = this.createQuestionField(props);
        this.ansHint = this.createAnsHintField(props);
        this.ansExplanation = this.createAnsExplanationField(props);
        this.hasAnsHint = props.question.hasAnsHint;
        this.hasAnsExplanation = props.question.hasAnsExplanation;

        makeObservable(this, {
            isEdit: observable,
            hasError: observable,
        });
    }

    get isSubQuestion(): boolean {
        return this.parentId !== null;
    }

    private createQuestionField(props: QuestionVmProps): FormsComposerFieldVm {
        const node = FormsComposerUtil.toNodeOrEmpty({
            text: props.question.question,
            schema: blockSchema,
        });

        const value = new FValue<FormsComposerDoc | null>(node, {
            validator: (val) => {
                if (FormsComposerUtil.isEmpty(val, blockSchema)) {
                    return "Question is required.";
                }
                const text = FormsComposerUtil.toTextOrEmpty({
                    doc: val,
                    schema: blockSchema,
                });
                if (text.length > FormQuestionConst.questionMaxLength) {
                    return `Question must not exceed ${FormQuestionConst.questionMaxLength} characters.`;
                }
                return null;
            },
        });

        return {
            value,
            ref: React.createRef<FormsComposerEditorRef | null>(),
        };
    }

    private createAnsHintField(props: QuestionVmProps): FormsComposerFieldVm {
        const node = FormsComposerUtil.toNodeOrEmpty({
            text: props.question.ansHint,
            schema: blockSchema,
        });

        const value = new FValue<FormsComposerDoc | null>(node, {
            validator: (val) => {
                const isRequired = props.question.ansHint != null;
                if (isRequired && FormsComposerUtil.isEmpty(val, blockSchema)) {
                    return "Answer hint is required.";
                }
                const text = FormsComposerUtil.toTextOrEmpty({
                    doc: val,
                    schema: blockSchema,
                });
                if (text.length > FormQuestionConst.answerHintMaxLength) {
                    return `Answer hint must not exceed ${FormQuestionConst.answerHintMaxLength} characters.`;
                }
                return null;
            },
        });

        return {
            value,
            ref: React.createRef<FormsComposerEditorRef | null>(),
        };
    }

    private createAnsExplanationField(props: QuestionVmProps): FormsComposerFieldVm {
        const node = FormsComposerUtil.toNodeOrEmpty({
            text: props.question.ansExplanation,
            schema: blockSchema,
        });

        const value = new FValue<FormsComposerDoc | null>(node, {
            validator: (val) => {
                const isRequired = props.question.ansExplanation != null;
                if (isRequired && FormsComposerUtil.isEmpty(val, blockSchema)) {
                    return "Answer explanation is required.";
                }
                const text = FormsComposerUtil.toTextOrEmpty({
                    doc: val,
                    schema: blockSchema,
                });
                if (text.length > FormQuestionConst.answerExplanationMaxLength) {
                    return `Answer explanation must not exceed ${FormQuestionConst.answerExplanationMaxLength} characters.`;
                }
                return null;
            },
        });

        return {
            value,
            ref: React.createRef<FormsComposerEditorRef | null>(),
        };
    }


    abstract validateAndGetQExtras(): QExtras | null | false;
    abstract validateAndGetAnswer(): Answer | null | false;

    toggleEdit(): void {
        if (this.isEdit) {
            this.commitEdits();
            if (this.hasError) return;
        }

        runInAction(() => {
            this.isEdit = !this.isEdit;
        });
    }


    /**
     * Syncs content from editor refs to FValues and runs validations.
     */
    public commitEdits() {
        // Sync content from editor refs to FValues
        const commonFields: FormsComposerFieldVm[] = [];
        commonFields.push(this.question);
        if (this.hasAnsHint) commonFields.push(this.ansHint);
        if (this.hasAnsExplanation) commonFields.push(this.ansExplanation);

        for (const field of commonFields) {
            const content = field.ref.current?.getContent() ?? null;
            runInAction(() => {
                field.value.set(content);
            });
        }
        
        // Validate all fields
        const commonFieldsHasError = FValueUtil.hasError(commonFields.map((f) => f.value));

        // Validate QExtras
        let qExtrasHasError = false;
        const qExtras = this.validateAndGetQExtras();
        if (qExtras === false) {
            qExtrasHasError = true;
        }
        else {
            this.qExtras = qExtras;
        }

        // Validate Answer
        let answerHasError = false;
        const answer = this.validateAndGetAnswer();
        if (answer === false) {
            answerHasError = true;
        }
        else {
            this.answer = answer;
        }

        runInAction(() => {
            if (commonFieldsHasError || qExtrasHasError || answerHasError) {
                this.hasError = true;
            }
            else {
                this.hasError = false;
            }
        });
    }

    public getBlockRichEditorText(field: FormsComposerFieldVm): string | null {
        return FormsComposerUtil.toText({
            doc: field.value.value,
            schema: blockSchema,
        });
    }


    abstract render(): React.ReactNode;
}
