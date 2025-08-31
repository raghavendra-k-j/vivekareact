import { JsonObj } from "~/core/types/Json";
import { Answer } from "~/domain/forms/models/answer/Answer";
import { QExtras } from "~/domain/forms/models/question/QExtras";
import { QuestionType } from "~/domain/forms/models/question/QuestionType";


export type SaveTranslationReqProps = {
    formId: number;
    translationId: number;
    languageId: string;
    title: string;
    description: string | null;
    questions: SaveTranslationQuestion[];
}

export class SaveTranslationReq {

    formId: number;
    translationId: number;
    languageId: string;
    title: string;
    description: string | null;
    questions: SaveTranslationQuestion[];

    constructor(props: SaveTranslationReqProps) {
        this.formId = props.formId;
        this.translationId = props.translationId;
        this.languageId = props.languageId;
        this.title = props.title;
        this.description = props.description;
        this.questions = props.questions;
    }

    toReqBody(): JsonObj {
        return {
            title: this.title,
            description: this.description,
            questions: this.questions.map(q => q.toJson()),
        };
    }
}


export type SaveTranslationQuestionProps = {
    id: number;
    type: QuestionType;
    question: string;
    qExtra: QExtras | null;
    answer: Answer | null;
    ansHint: string | null;
    ansExplanation: string | null;
    subQuestions: SaveTranslationQuestion[] | null;
    parentId: number | null;
}

export class SaveTranslationQuestion {

    id: number;
    type: QuestionType;
    question: string;
    qExtra: QExtras | null;
    answer: Answer | null;
    ansHint: string | null;
    ansExplanation: string | null;
    subQuestions: SaveTranslationQuestion[] | null;
    parentId: number | null;

    constructor(props: SaveTranslationQuestionProps) {
        this.id = props.id;
        this.type = props.type;
        this.question = props.question;
        this.qExtra = props.qExtra;
        this.answer = props.answer;
        this.ansHint = props.ansHint;
        this.ansExplanation = props.ansExplanation;
        this.subQuestions = props.subQuestions || [];
        this.parentId = props.parentId || null;
    }

    toJson(): JsonObj {
        return {
            id: this.id,
            type: this.type.type,
            question: this.question,
            qExtra: this.qExtra ? this.qExtra.toJson() : null,
            answer: this.answer ? this.answer.toJson() : null,
            ansHint: this.ansHint,
            ansExplanation: this.ansExplanation,
            subQuestions: this.subQuestions ? this.subQuestions.map(q => q.toJson()) : null,
            parentId: this.parentId,
        };
    }
}