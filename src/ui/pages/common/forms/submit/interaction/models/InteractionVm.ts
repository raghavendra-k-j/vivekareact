import { makeObservable } from "mobx";
import type { QuestionsRes } from "~/domain/forms/models/QuestionsRes";
import type { Question } from "~/domain/forms/models/question/Question";
import type { InteractionStore } from "../InteractionStore";
import { QuestionVmFactory } from "./QuestionVmFactory";
import type { QuestionVm } from "./QuestionVm";
import { ThingId } from "~/core/utils/ThingId";


export type InteractionFormVmProps = {
    title: string;
    description?: string;
}

export class InteractionFormVm {
    title: string;
    description?: string;

    constructor(props: InteractionFormVmProps) {
        this.title = props.title;
        this.description = props.description;
    }
}


type InteractionVmProps = {
    parentStore: InteractionStore;
    questionRes: QuestionsRes;
};

export class InteractionVm {
    thingId: string = ThingId.generate();
    formDetail: InteractionFormVm;
    questions!: QuestionVm[];
    parentStore: InteractionStore;

    constructor(props: InteractionVmProps) {
        this.parentStore = props.parentStore;
        const shuffle = this.parentStore.formDetail.shuffle === true;

        this.formDetail = new InteractionFormVm({
            title: props.questionRes.title,
            description: props.questionRes.description,
        });

        let questions = props.questionRes.questions;
        if (shuffle) {
            questions = questions.sort(() => Math.random() - 0.5);
            questions.forEach((q, index) => {
                q.dOrder = index + 1;
                if(q.type.isGroup) {
                    q.subQuestions?.forEach((subQ, subIndex) => {
                        subQ.dOrder = subIndex + 1;
                    });
                }
            });
        }

        this.initQuestionVms(questions);
        makeObservable(this, {

        });
    }

    get totalQuestions() {
        return this.questions.length;
    }

    dispose() {

    }

    private initQuestionVms(questions: Question[]) {
        this.questions = questions.map(question => {
            return QuestionVmFactory.create({ question: question, store: this });
        });
    }
}
