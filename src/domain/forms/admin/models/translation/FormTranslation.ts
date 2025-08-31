import { Language } from "~/domain/forms/models/Language";
import { FormTranslationQuestion } from "./FormTranslationQuestion";
import { JsonObj } from "~/core/types/Json";

export type FormTranslationProps = {
    formId: number;
    translationId: number;
    title: string;
    description: string | null;
    language: Language;
    questions: FormTranslationQuestion[];
}

export class FormTranslation {

    formId: number;
    translationId: number;
    title: string;
    description: string | null;
    language: Language;
    questions: FormTranslationQuestion[];

    constructor(props: FormTranslationProps) {
        this.formId = props.formId;
        this.translationId = props.translationId;
        this.title = props.title;
        this.description = props.description;
        this.language = props.language;
        this.questions = props.questions;
    }

    static fromJson(json: JsonObj): FormTranslation {
        const questions = json.questions.map((q: JsonObj) => FormTranslationQuestion.fromJson(q));
        return new FormTranslation({
            formId: json.formId,
            translationId: json.translationId,
            title: json.title,
            description: json.description ? json.description : null,
            language: Language.fromJson(json.language),
            questions: questions,
        });
    }
}
