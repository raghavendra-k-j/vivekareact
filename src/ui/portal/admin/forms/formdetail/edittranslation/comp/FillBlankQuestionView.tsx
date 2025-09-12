import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import { MdQRenderer } from "~/ui/components/form/commons/questionmarkit";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerField } from "~/ui/components/formscomposer/FormsComposerEditorField";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { FillBlankItemVm, FillBlankQuestionVm } from "../models/FillBlankQuestionVm";
import { QuestionCard } from "./QuestionCard";
import { QuestionFooter } from "./QuestionFooter";
import { QuestionHeader } from "./QuestionHeader";
import { TextAnswerPreview } from "./TextAnswerPreview";

export type FillBlankQuestionViewProps = {
    vm: FillBlankQuestionVm;
};

export function FillBlankQuestionView({ vm }: FillBlankQuestionViewProps) {
    return (
        <QuestionCard vm={vm}>
            <QuestionHeader vm={vm} />
            <Observer>
                {() => (
                    vm.isEdit ? (
                        <EditFillBlankList vm={vm} />
                    ) : (
                        <ReadFillBlankList vm={vm} />
                    )
                )}
            </Observer>
            <QuestionFooter vm={vm} />
        </QuestionCard>
    );
}

type FillBlankListProps = {
    vm: FillBlankQuestionVm;
};

function EditFillBlankList({ vm }: FillBlankListProps) {
    return (
        <div className="flex flex-col gap-4 px-6 my-4">
            {vm.items.map((item, index) => (
                <EditFillBlankItem
                    key={item.id}
                    label={`Fill up ${index + 1} answer`}
                    item={item}
                    vm={vm}
                />
            ))}
        </div>
    );
}

type EditFillBlankItemProps = {
    label: string;
    item: FillBlankItemVm;
    vm: FillBlankQuestionVm;
};

function EditFillBlankItem({ label, item, vm }: EditFillBlankItemProps) {
    useEffect(() => {
        const changeListener = (node: FormsComposerDoc) => {
            item.editorVm.value.set(node);
        };
        item.editorVm.ref.current?.addChangeListener(changeListener);
        return () => {
            item.editorVm.ref.current?.removeChangeListener(changeListener);
        };
    }, [item.editorVm.ref, item.editorVm.value]);


    return (
        <FormsComposerField
            ref={item.editorVm.ref}
            schema={inlineSchema}
            label={label}
            value={item.editorVm.value}
            placeholder={`Enter fill up ${item.id} answer`}
            options={vm.storeRef.inlineComposerOptions}
        />
    );
}

function ReadFillBlankList({ vm }: FillBlankListProps) {
    return (
        <div className="flex flex-col gap-3 px-6 my-4">
            {vm.items.map((item) => (
                <ReadFillBlankItem key={item.id} item={item} />
            ))}
        </div>
    );
}

type ReadFillBlankItemProps = {
    item: FillBlankItemVm;
};

function ReadFillBlankItem({ item }: ReadFillBlankItemProps) {
    const node = item.editorVm.value.value;
    const text = FormsComposerUtil.toTextOrEmpty({
        doc: node,
        schema: inlineSchema,
    });
    const html = MdQRenderer.fillBlanksText(text);
    return (
        <TextAnswerPreview
            label={`Fill up ${item.id} answer`}
            answer={html}
        />
    );
}
