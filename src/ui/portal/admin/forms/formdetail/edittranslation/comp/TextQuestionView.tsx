import { Observer } from "mobx-react-lite";
import { QuestionCard } from "./QuestionCard";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionFooter } from "./QuestionFooter";
import { TextQuestionVm } from "../models/TextQuestionVm";
import { MdQRenderer } from "~/ui/components/form/commons/questionmarkit";
import { useEffect } from "react";
import { TextAnswerPreview } from "./TextAnswerPreview";
import { blockSchema, inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerField } from "~/ui/components/formscomposer/FormsComposerEditorField";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";

export type TextQuestionViewProps = {
    vm: TextQuestionVm;
};

export function TextQuestionView({ vm }: TextQuestionViewProps) {
    return (
        <QuestionCard vm={vm}>
            <QuestionHeader vm={vm} />
            {vm.answer && (<AnswerContent vm={vm} />)}
            <QuestionFooter vm={vm} />
        </QuestionCard>
    );
}

function AnswerContent({ vm }: { vm: TextQuestionVm }) {
    return (
        <div className="my-4 px-6">
            <Observer>
                {() =>
                    vm.isEdit ? <EditAnswer vm={vm} /> : <ReadAnswer vm={vm} />
                }
            </Observer>
        </div>
    );
}

function EditAnswer({ vm }: { vm: TextQuestionVm }) {
    const answer = vm.answerVm!;
    const schema = vm.type.isTextArea ? blockSchema : inlineSchema;

    useEffect(() => {
        const changeListener = (node: FormsComposerDoc) => {
            answer.value.set(node);
        };
        answer.ref.current?.addChangeListener(changeListener);
        return () => {
            answer.ref.current?.removeChangeListener(changeListener);
        };
    }, [answer.ref, answer.value]);


    return (
        <FormsComposerField
            ref={answer.ref}
            schema={schema}
            label="Answer"
            value={answer.value}
            placeholder="Enter answer"
            options={vm.type.isTextArea ? vm.storeRef.blockComposerOptions : vm.storeRef.inlineComposerOptions}
        />
    );
}

function ReadAnswer({ vm }: { vm: TextQuestionVm }) {
    const answer = vm.answerVm;
    if (!answer || !answer.value.value) return null;

    const schema = vm.type.isTextArea ? blockSchema : inlineSchema;
    const text = FormsComposerUtil.toTextOrEmpty({
        doc: answer.value.value,
        schema,
    }).trim();

    if (!text) return null;

    return (
        <TextAnswerPreview
            label="Answer"
            answer={vm.type.isTextArea ? MdQRenderer.blockTextAnswer(text) : MdQRenderer.inlineTextAnswer(text)}
        />
    );
}