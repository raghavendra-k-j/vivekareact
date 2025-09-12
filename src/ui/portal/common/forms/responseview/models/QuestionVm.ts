import { RDQuestion } from "~/domain/forms/models/RDQuestion";
import { ResponseViewStore } from "../ResponseViewStore";
import { QuestionType } from "~/domain/forms/models/question/QuestionType";
import { QExtras } from "~/domain/forms/models/question/QExtras";
import { QuestionLevel } from "~/domain/forms/models/question/QuestionLevel";
import { Bool3 } from "~/core/utils/Bool3";
import { Answer } from "~/domain/forms/models/answer/Answer";
import { MEvaluationStatus } from "~/domain/forms/models/MEvaluationStatus";
import { QMediaTile } from "~/domain/forms/models/qmedia/QMediaTile";

export type RDQuestionVmProps = {
    question: RDQuestion;
    storeRef: ResponseViewStore;
}

export class RDQuestionVm {
    public readonly id: number;
    public readonly formId: number;
    public readonly parentId: number | null;
    public readonly dOrder: number;
    public readonly type: QuestionType;
    public readonly question: string;
    public readonly qExtras: QExtras | null;
    public readonly ansHint: string | null;
    public readonly level: QuestionLevel | null;
    public readonly marks: number | null;
    public readonly mediaFiles: QMediaTile[] | null;
    public readonly isRequired: Bool3;
    public readonly answer: Answer | null;
    public readonly userAnswer: Answer | null;
    public readonly ansExplanation: string | null;
    public readonly gainedMarks: number | null;
    public readonly parentQuestionText: string | null;
    public readonly qNumber: number;
    public readonly subQNumber: number | null;
    public readonly mEvaluationStatus: MEvaluationStatus | null;
    public readonly storeRef: ResponseViewStore;


    constructor(props: RDQuestionVmProps) {
        const q = props.question;
        this.id = q.id;
        this.formId = q.formId;
        this.parentId = q.parentId;
        this.dOrder = q.dOrder;
        this.type = q.type;
        this.question = q.question;
        this.qExtras = q.qExtras;
        this.ansHint = q.ansHint;
        this.level = q.level;
        this.marks = q.marks;
        this.mediaFiles = q.mediaFiles;
        this.isRequired = q.isRequired;
        this.answer = q.answer;
        this.userAnswer = q.userAnswer;
        this.ansExplanation = q.ansExplanation;
        this.gainedMarks = q.gainedMarks;
        this.parentQuestionText = q.parentQuestionText;
        this.qNumber = q.qNumber;
        this.subQNumber = q.subQNumber;
        this.mEvaluationStatus = q.mEvaluationStatus;
        this.storeRef = props.storeRef;
    }


    get hasMarks(): boolean {
        return this.marks !== undefined && this.marks != null && this.marks > 0;
    }


    get hasPositiveGainedMarks(): boolean {
        return this.gainedMarks !== undefined && this.gainedMarks != null && this.gainedMarks > 0;
    }

    get isAnswered(): boolean {
        if(this.userAnswer === null) return false;
        if(this.userAnswer === undefined) return false;
        return true;
    }

}