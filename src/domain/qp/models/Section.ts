import { JsonObj } from "~/core/types/Json";
import { Question } from "./Question";

export type SectionProps = {
    title: string;
    questions: Question[];
}


export class Section {

    public readonly title: string;
    public readonly questions: Question[];
    totalMarks: number;


    constructor(props: SectionProps) {
        this.title = props.title;
        this.questions = props.questions;
        this.totalMarks = this.computeTotalMarks();
    }

    get totalQuestions(): number {
        return this.questions.length;
    }


    private computeTotalMarks(): number {
        return this.questions.reduce((sum, question) => sum + question.marks, 0);
    }

    static fromJson(data: JsonObj): Section {
        let questions: Question[] = [];
        if (data.questions && Array.isArray(data.questions)) {
            questions = data.questions.map((q: JsonObj) => Question.fromJson(q));
        }
        return new Section({
            title: data.title,
            questions: questions
        });
    }

}