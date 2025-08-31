import { QuestionVm, type QuestionRendererProps, type QuestionVmProps } from "./QuestionVm";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { Answer, TextAreaAnswer, TextBoxAnswer } from "~/domain/forms/models/answer/Answer";
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { FormQuestionConst } from "~/domain/forms/const/FormQuestionConst";
import { TextQuestionView } from "../comp/TextQuestionView";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { blockSchema, inlineSchema } from "~/ui/components/formscomposer/core/schema";

type TextQuestionVmProps = QuestionVmProps & {};

export class TextQuestionVm extends QuestionVm {

    public ansNode: ProseMirrorNode | undefined = undefined;

    constructor(props: TextQuestionVmProps) {
        super(props);
        makeObservable(this, {
            ansNode: observable.ref,
            isAnswered: computed
        });
    }

    get isMultiline(): boolean {
        return this.base.type.isTextArea;
    }

    public onAnsStrChanged(value: ProseMirrorNode): void {
        runInAction(() => {
            this.ansNode = value;
        });
        this.validate();
    }

    get isAnswered(): boolean {
        if (this.ansNode === undefined) {
            return false;
        }
        const html = FormsComposerUtil.toTextOrEmpty({
            doc: this.ansNode,
            schema: this.isMultiline ? blockSchema : inlineSchema
        });
        return html.length > 0;
    }

    get ansString(): string {
        if (this.ansNode === undefined) {
            return '';
        }
        return FormsComposerUtil.toTextOrEmpty({
            doc: this.ansNode,
            schema: this.isMultiline ? blockSchema : inlineSchema
        });
    }

    validateQuestion(): string | undefined {
        if (this.base.isRequired.isTrue && !this.isAnswered) {
            return QuestionVm.DEFAULT_REQUIRED_ERROR_MESSAGE;
        }
        const ansString = this.ansString;
        if (this.isMultiline) {
            if (ansString.length > FormQuestionConst.textareaAnswerMaxLength) {
                return `Answer exceeds the maximum length of ${FormQuestionConst.textareaAnswerMaxLength} characters.`;
            }
        }
        else {
            if (ansString.length > FormQuestionConst.textboxAnswerMaxLength) {
                return `Answer exceeds the maximum length of ${FormQuestionConst.textboxAnswerMaxLength} characters.`;
            }
        }
        return undefined;
    }

    render(props: QuestionRendererProps): React.JSX.Element {
        return <TextQuestionView vm={this} parentVm={props.parentVm} />;
    }

    getAnswer(): Answer | undefined {
        if (!this.isAnswered) {
            return undefined;
        }
        const ansString = FormsComposerUtil.toTextOrEmpty({
            doc: this.ansNode!,
            schema: this.isMultiline ? blockSchema : inlineSchema
        });
        if (this.isMultiline) {
            return new TextAreaAnswer({ answer: ansString });
        }
        else {
            return new TextBoxAnswer({ answer: ansString });
        }
    }
}
