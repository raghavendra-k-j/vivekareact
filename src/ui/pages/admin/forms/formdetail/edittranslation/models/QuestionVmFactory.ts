import { FormTranslationQuestion } from "~/domain/forms/admin/models/translation/FormTranslationQuestion";
import { QuestionVm } from "./QuestionVm";
import { ObjectiveQuestionVm } from "./ObjectiveQuestionVm";
import { EditTranslationStore } from "../EditTranslationStore";
import { TextQuestionVm } from "./TextQuestionVm";
import { FillBlankQuestionVm } from "./FillBlankQuestionVm";
import { PairMatchQuestionVm } from "./PairMatchQuestionVm";
import { GroupQuestionVm } from "./GroupQuestionVm";
import { SaveTranslationQuestion } from "~/domain/forms/admin/models/translation/SaveTranslationReq";

export type CreateQuestionVmProps = {
    storeRef: EditTranslationStore;
    question: FormTranslationQuestion;
}

export abstract class QuestionVmUtil {

    static create(props: CreateQuestionVmProps): QuestionVm | null {
        const question = props.question;
        const type = question.type;
        if (type.isObjective || type.isTrueFalse) {
            return ObjectiveQuestionVm.create({
                storeRef: props.storeRef,
                question: question,
            });
        }
        else if (type.isTextArea || type.isTextBox) {
            return TextQuestionVm.create({
                storeRef: props.storeRef,
                question: question,
            });
        }
        else if (type.isFillBlank) {
            return FillBlankQuestionVm.create({
                storeRef: props.storeRef,
                question: question,
            });
        }
        else if (type.isPairMatch) {
            return PairMatchQuestionVm.create({
                storeRef: props.storeRef,
                question: question,
            });
        }
        else if (type.isGroup) {
            return GroupQuestionVm.create({
                storeRef: props.storeRef,
                question: question,
            });
        }
        return null;
    }

    static toReq(q: QuestionVm): SaveTranslationQuestion {
        let subQuestions: SaveTranslationQuestion[] | null = null;
        if (q instanceof GroupQuestionVm) {
            subQuestions = q.subQuestions.map((q) => QuestionVmUtil.toReq(q));
        }
        return new SaveTranslationQuestion({
            id: q.id,
            type: q.type,
            question: q.getBlockRichEditorText(q.question)!,
            qExtra: q.qExtras,
            answer: q.answer,
            ansHint: q.getBlockRichEditorText(q.ansHint),
            ansExplanation: q.getBlockRichEditorText(q.ansExplanation),
            subQuestions: subQuestions,
            parentId: q.parentId,
        });
    }


}
