import { JsonObj } from "~/core/types/Json";
import { Answer } from "~/domain/forms/models/answer/Answer";
import { QExtras } from "~/domain/forms/models/question/QExtras";
import { QuestionType } from "~/domain/forms/models/question/QuestionType";

export type FormTranslationQuestionProps = {
  id: number;
  type: QuestionType;
  question: string;
  qExtras: QExtras | null;
  answer: Answer | null;
  ansHint: string | null;
  ansExplanation: string | null;
  dOrder: number;
  parentId: number | null;
  subQuestions: FormTranslationQuestion[] | null;
}

export class FormTranslationQuestion {
  id: number;
  type: QuestionType;
  question: string;
  qExtras: QExtras | null;
  answer: Answer | null;
  ansHint: string | null;
  ansExplanation: string | null;
  dOrder: number;
  parentId: number | null;
  subQuestions: FormTranslationQuestion[] | null;


  constructor(props: FormTranslationQuestionProps) {
    this.id = props.id;
    this.type = props.type;
    this.question = props.question;
    this.qExtras = props.qExtras;
    this.answer = props.answer;
    this.ansHint = props.ansHint;
    this.ansExplanation = props.ansExplanation;
    this.dOrder = props.dOrder;
    this.parentId = props.parentId;
    this.subQuestions = props.subQuestions || [];
  }

  get hasAnsHint(): boolean {
    return this.ansHint !== null;
  }

  get hasAnsExplanation(): boolean {
    return this.ansExplanation !== null;
  }


  static fromJson(json: JsonObj): FormTranslationQuestion {
    const type = QuestionType.fromType(json.type)!;
    const qExtras = json.qExtra ? QExtras.fromTypeAndMap(type, json.qExtra) : null;
    const answer = json.answer ? Answer.fromTypeAndQExtrasAndMap({ type: type, qExtras: qExtras, map: json.answer }) : null;
    const subQuestions = json.subQuestions ? json.subQuestions.map((subJson: JsonObj) => FormTranslationQuestion.fromJson(subJson)) : null;
    return new FormTranslationQuestion({
      id: json.id,
      type: type,
      question: json.question,
      qExtras: qExtras,
      answer: answer,
      ansHint: json.ansHint || null,
      ansExplanation: json.ansExplanation || null,
      dOrder: json.dOrder,
      parentId: json.parentId || null,
      subQuestions: subQuestions,
    });
  }
}