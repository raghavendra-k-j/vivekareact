import type { JSX } from "react";
import type { Question } from "~/domain/forms/models/question/Question";
import { QuestionVmBase } from "./QuestionBase";
import type { InteractionVm } from "./InteractionVm";
import { runInAction } from "mobx";
import { InstanceId } from "~/core/utils/InstanceId";
import { GroupQuestionVm } from "./GroupQuestionVm";
import { Answer } from "~/domain/forms/models/answer/Answer";
import { SpeakQuestionUtil } from "../../../utils/SpeakQuestionUtil";

export type QuestionRendererProps = {
    vm: QuestionVm;
    parentVm?: GroupQuestionVm;
}

export type QuestionVmProps = {
    question: Question;
    store: InteractionVm;
}

export abstract class QuestionVm {

    static readonly DEFAULT_REQUIRED_ERROR_MESSAGE = "This question must be answered.";

    public base: QuestionVmBase;
    public instanceId = InstanceId.generate("QuestionVm");

    abstract get isAnswered(): boolean;

    get hasError(): boolean {
        return this.base.error !== undefined && this.base.error !== null;
    }

    validate(): string | undefined {
        if (!this.base.isVisible) {
            return undefined;
        }
        const err = this.validateQuestion();
        runInAction(() => {
            this.base.error = err || null;
        });
        return err;
    }

    abstract validateQuestion(): string | undefined;

    constructor(vmProps: QuestionVmProps) {
        this.base = new QuestionVmBase({
            question: vmProps.question,
            store: vmProps.store,
        });
    }

    abstract render(props: QuestionRendererProps): JSX.Element;

    abstract getAnswer(): Answer | undefined;

    getSpeechText(): string {
        return SpeakQuestionUtil.readQuestion(this.base.question);
    };
    
}