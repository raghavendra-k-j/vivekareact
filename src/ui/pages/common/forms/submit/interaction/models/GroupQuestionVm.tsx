import { Answer } from "~/domain/forms/models/answer/Answer";
import { QuestionVm, type QuestionVmProps } from "./QuestionVm";
import { QuestionVmFactory } from "./QuestionVmFactory";
import { computed, makeObservable } from "mobx";
import { GroupQuestionView } from "../comp/GroupQuestionView";


export class GroupQuestionVm extends QuestionVm {

    subQuestions: QuestionVm[];

    constructor(props: QuestionVmProps) {
        super(props);
        this.subQuestions = [];
        const sQuestions = props.question.subQuestions || [];
        for (const q of sQuestions) {
            const subQuestion = QuestionVmFactory.create({ question: q, store: props.store });
            if (subQuestion instanceof QuestionVm) {
                this.subQuestions.push(subQuestion);
            }
        }
        makeObservable(this, {
            isAnswered: computed,
            answeredOutOfTotal: computed,
        });
    }

    get isAnswered(): boolean {
        return this.subQuestions.every(q => q.isAnswered);
    }

    render(): React.JSX.Element {
        return <GroupQuestionView vm={this} />;
    }


    get answeredOutOfTotal(): { total: number; answered: number } {
        const total = this.subQuestions.length;
        const answered = this.subQuestions.filter(q => q.isAnswered).length;
        return { total, answered };
    }

    validateQuestion(): string | undefined {
        return undefined;
    }

    getAnswer(): Answer | undefined {
        return undefined;
    }


}