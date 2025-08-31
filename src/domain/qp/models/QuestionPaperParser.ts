import { QuestionPaper } from "./QuestionPaper";
import { Section } from "./Section";
import { Question } from "./Question";

export class QuestionPaperParser {


    public static parseFromXml(xml: string): QuestionPaper {
        const cleanXml = this.extractQuestionPaperXml(xml);
        const doc = new DOMParser().parseFromString(cleanXml, "application/xml");
        const qpElem = doc.querySelector("questionPaper");
        if (!qpElem) throw new Error("Invalid XML: Missing <questionPaper>");
        return this.parseQuestionPaper(qpElem);
    }

    private static extractQuestionPaperXml(input: string): string {
        const match = input.match(/<questionPaper[\s\S]*?<\/questionPaper>/);
        if (!match) throw new Error("Input does not contain a valid <questionPaper> XML block");
        return match[0];
    }

    private static parseQuestionPaper(qpElem: Element): QuestionPaper {
        const sectionElems = qpElem.querySelectorAll("sections > section");
        const sections: Section[] = this.parseSections(sectionElems);
        const titleElem = qpElem.querySelector("title");
        const qpTitle = titleElem ? titleElem.textContent || "" : "";
        const planElem = qpElem.querySelector("plan");
        return new QuestionPaper({
            title: qpTitle,
            sections: sections,
            plan: planElem ? planElem.textContent || "" : "",
        });
    }

    private static parseSections(sectionElems: NodeListOf<Element>): Section[] {
        const sections: Section[] = [];
        sectionElems.forEach(sectionElem => {
            const titleElem = sectionElem.querySelector("title");
            const title = titleElem ? titleElem.textContent || "" : "";
            const questionElems = sectionElem.querySelectorAll("questions > question");
            const questions = this.parseQuestions(questionElems);
            sections.push(new Section({ title, questions }));
        });
        return sections;
    }

    private static parseQuestions(questionElems: NodeListOf<Element>): Question[] {
        const questions: Question[] = [];
        questionElems.forEach(qElem => {
            const text = qElem.querySelector("text")?.textContent || "";
            const answer = qElem.querySelector("answer")?.textContent || "";
            const marks = Number(qElem.querySelector("marks")?.textContent || 0);
            questions.push(new Question({ question: text, answer, marks }));
        });
        return questions;
    }


}