import { JsonObj } from "~/core/types/Json";

export type QuestionProps = {
    question: string;
    answer: string;
    marks: number;
}


export class Question {

    public readonly question: string;
    public readonly answer: string;
    public readonly marks: number;

    constructor(props: QuestionProps) {
        this.question = props.question;
        this.answer = props.answer;
        this.marks = props.marks;
    }

    static fromJson(data: JsonObj): Question {
        return new Question({
            question: data.question,
            answer: data.answer,
            marks: data.marks
        });
    }
}