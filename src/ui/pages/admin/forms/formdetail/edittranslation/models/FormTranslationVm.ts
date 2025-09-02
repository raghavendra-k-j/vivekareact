import { Language } from "~/domain/forms/models/Language";
import { FormTranslation } from "~/domain/forms/admin/models/translation/FormTranslation";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { QuestionVm } from "./QuestionVm";
import { QuestionVmUtil } from "./QuestionVmFactory";
import { EditTranslationStore } from "../EditTranslationStore";
import { StrUtils } from "~/core/utils/StrUtils";
import { FormConst } from "~/domain/forms/const/FormConst";
import { logger } from "~/core/utils/logger";

export type FormTranslationVmProps = {
    storeRef: EditTranslationStore;
    formId: number;
    translationId: number;
    title: string;
    description: string | null;
    language: Language;
    questions: QuestionVm[];
}

export class FormTranslationVm {

    storeRef: EditTranslationStore;
    formId: number;
    translationId: number;

    title: InputValue<string>;
    description: InputValue<string>;
    hasDescription: boolean;

    language: Language;
    questions: QuestionVm[];


    get formType() {
        return this.storeRef.fd.type;
    }

    constructor(props: FormTranslationVmProps) {
        this.storeRef = props.storeRef;
        this.formId = props.formId;
        this.translationId = props.translationId;

        this.hasDescription = props.description !== null;

        this.title = new InputValue<string>(props.title, {
            validator: (value) => {
                const trimmedValue = StrUtils.trimToNull(value);
                if (trimmedValue == null) return "Title is required.";
                if (trimmedValue.length > FormConst.titleMaxLength)
                    return `Title must not exceed ${FormConst.titleMaxLength} characters.`;
                return null;
            }
        });

        this.description = new InputValue<string>(props.description || "", {
            validator: (value) => {
                const trimmedValue = StrUtils.trimToNull(value);
                if (trimmedValue == null) return "Description is required.";
                if (trimmedValue.length > FormConst.descriptionMaxLength)
                    return `Description must not exceed ${FormConst.descriptionMaxLength} characters.`;
                return null;
            }
        });

        this.language = props.language;
        this.questions = props.questions;
    }

    static fromModel({ model, storeRef }: { model: FormTranslation; storeRef: EditTranslationStore }): FormTranslationVm {
        try {
            const questions: QuestionVm[] = [];
            for (const q of model.questions) {
                const question = QuestionVmUtil.create({ storeRef: storeRef, question: q, });
                if (question) {
                    questions.push(question);
                }
            }
            return new FormTranslationVm({
                storeRef: storeRef,
                formId: model.formId,
                translationId: model.translationId,
                title: model.title,
                description: model.description,
                language: model.language,
                questions: questions,
            });
        }
        catch (error) {
            logger.error("Error creating FormTranslationVm from model:", error);
            throw error;
        }
    }
}