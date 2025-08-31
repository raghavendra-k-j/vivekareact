import { JsonObj } from "~/core/types/Json";
import { Question } from "./question/Question";

type QuestionsResProps = {
  title: string;
  description?: string;
  questions: Question[];
}

export class QuestionsRes {
  title: string;
  description?: string;
  questions: Question[];

  constructor({ ...props }: QuestionsResProps) {
    this.title = props.title;
    this.description = props.description;
    this.questions = props.questions;
  }

  static fromJson(json: JsonObj): QuestionsRes {
    return new QuestionsRes({
      title: json.title,
      description: json.description,
      questions: json.questions.map((q: JsonObj) => Question.fromJson(q)),
    });
  }

}