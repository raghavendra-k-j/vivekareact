import { QuestionType } from "~/domain/forms/models/question/QuestionType";
import { UpsertQuestionVm } from "./UpsertQuestionVm";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { EnAVmFactory } from "../ena/EnAVmFactory";
import { Bool3 } from "~/core/utils/Bool3";
import { QuestionOptions } from "../ena/QuestionOptions";
import { QuestionLevel } from "~/domain/forms/models/question/QuestionLevel";
import { Question } from "~/domain/forms/admin/models/Question";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { blockSchema } from "~/ui/components/formscomposer/core/schema";
import { UpsertQuestionStore } from "../UpsertQuestionStore";

export class UpsertQuestionVmFactory {


    static empty(props: { type: QuestionType, storeRef: UpsertQuestionStore }): UpsertQuestionVm {
        const formType = props.storeRef.formType;
        const questionType = props.type;

        const typeField = new InputValue<QuestionType | null>(props.type);
        const enaVm = EnAVmFactory.empty({
            type: typeField.value!,
            storeRef: props.storeRef,
        });
        const questionOptions = QuestionOptions.empty({
            storeRef: props.storeRef,
            type: typeField.value!,
        });

        const requiredField = new InputValue<Bool3>(props.type.isGroup ? Bool3.N : Bool3.F);
        const level = new InputValue<QuestionLevel | null>(null);
        const marks = new InputValue<string>("");
        const ansHintNode = null;
        const ansExplanationNode = null;
        const scorable = new InputValue<Bool3>(Bool3.N);

        if (formType.isAssessment) {
            const marksPolicy = questionType.assmntMarksPolicy;
            if (marksPolicy.isRequired || marksPolicy.isOptional) {
                marks.set("1");
                level.set(QuestionLevel.medium);
                scorable.set(Bool3.T);
            }
        }

        return new UpsertQuestionVm({
            id: null,
            storeRef: props.storeRef,
            type: typeField,
            questionNode: null,
            enaVm: enaVm,
            questionOptions: questionOptions,
            scorable: scorable,
            level: level,
            marks: marks,
            ansHintNode: ansHintNode,
            ansExplanationNode: ansExplanationNode,
            isRequired: requiredField,
        });
    }

    static fromQuestion(props: { question: Question, storeRef: UpsertQuestionStore }): UpsertQuestionVm {
        const formType = props.storeRef.formType;
        const questionType = props.question.type;

        const typeField = new InputValue<QuestionType | null>(questionType);
        const enaVm = EnAVmFactory.fromQuestion({
            question: props.question,
            storeRef: props.storeRef,
        });

        const questionOptions = QuestionOptions.fromQuestion({
            question: props.question,
            storeRef: props.storeRef,
        });

        const questionNode = FormsComposerUtil.toNode({
            text: props.question.question,
            schema: blockSchema,
        });
        const mediaFiles = props.question.mediaFiles.map(m => m.toTile());

        const scorable = new InputValue<Bool3>(Bool3.N);
        const marksField = new InputValue<string>("");
        const level = new InputValue<QuestionLevel | null>(null);
        let ansHintNode: ProseMirrorNode | null = null;
        let ansExplanationNode: ProseMirrorNode | null = null;

        if (formType.isAssessment) {
            const marksPolicy = questionType.assmntMarksPolicy;
            if (marksPolicy.isRequired || marksPolicy.isOptional) {
                if (props.question.marks) {
                    scorable.set(Bool3.T);
                    marksField.set(props.question.marks.toString());
                    level.set(props.question.level);
                    ansExplanationNode = FormsComposerUtil.toNode({
                        text: props.question.ansExplanation,
                        schema: blockSchema,
                    });
                    ansHintNode = FormsComposerUtil.toNode({
                        text: props.question.ansHint,
                        schema: blockSchema,
                    });
                }
            }
            else {
                scorable.set(Bool3.N);
            }
        }
        const isRequired = new InputValue<Bool3>(props.question.isRequired);
        return new UpsertQuestionVm({
            id: props.question.id,
            storeRef: props.storeRef,
            type: typeField,
            questionNode: questionNode,
            enaVm: enaVm,
            questionOptions: questionOptions,
            scorable: scorable,
            level: level,
            marks: marksField,
            ansHintNode: ansHintNode,
            ansExplanationNode: ansExplanationNode,
            isRequired: isRequired,
            mediaFiles: mediaFiles,
        });
    }
}