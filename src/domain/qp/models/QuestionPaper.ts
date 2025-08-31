import { JsonObj } from "~/core/types/Json";
import { Section } from "./Section";

export type QuestionPaperProps = {
    title: string;
    plan: string;
    sections: Section[];
}

export class QuestionPaper {

    public readonly title: string;
    public readonly plan: string;
    public readonly sections: Section[];
    totalMarks: number;
    totalQuestions: number;
    totalSections: number;

    constructor(props: QuestionPaperProps) {
        this.title = props.title;
        this.plan = props.plan;
        this.sections = props.sections;
        this.totalMarks = this.computeTotalMarks();
        this.totalQuestions = this.computeTotalQuestions();
        this.totalSections = this.sections.length;
    }

    private computeTotalMarks(): number {
        return this.sections.reduce((sum, section) => sum + section.totalMarks, 0);
    }

    private computeTotalQuestions(): number {
        return this.sections.reduce((sum, section) => sum + section.totalQuestions, 0);
    }

    getSectionByIndex(index: number): Section | undefined {
        return this.sections[index];
    }

    static fromJson(data: JsonObj): QuestionPaper {
        let sections: Section[] = [];
        if (data.sections && Array.isArray(data.sections)) {
            sections = data.sections.map((s: JsonObj) => Section.fromJson(s));
        }
        return new QuestionPaper({
            title: data.title,
            plan: data.plan,
            sections: sections
        });
    }

}
