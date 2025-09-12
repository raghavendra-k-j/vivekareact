import { Observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { QuestionExplanationView } from "~/ui/components/form/commons/ExplanationText";
import { HintTextView } from "~/ui/components/form/commons/HintText";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";
import { blockSchema, FormsComposerSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsComposerField } from "~/ui/components/formscomposer/FormsComposerEditorField";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { QuestionVm } from "../models/QuestionVm";
import { EditTranslationStore } from "../EditTranslationStore";

export type QuestionFooterProps = {
    vm: QuestionVm;
};

export function QuestionFooter({ vm }: QuestionFooterProps) {
    return (
        <div className="px-6 flex flex-col gap-2">
            {vm.hasAnsHint && <Hint vm={vm} />}
            {vm.hasAnsExplanation && <Explanation vm={vm} />}
        </div>
    );
}



function Hint({ vm }: QuestionFooterProps) {
    return (
        <Observer>
            {() => {
                if (vm.isEdit) {
                    return (
                        <ReusableRichEditorField
                            store={vm.storeRef}
                            label="Hint"
                            placeholder="Enter hint"
                            value={vm.ansHint.value}
                            refObj={vm.ansHint.ref}
                            schema={blockSchema}
                            onChange={node => vm.ansHint.value.set(node)}
                        />
                    );
                }
                const text = FormsComposerUtil.toTextOrEmpty({
                    doc: vm.ansHint.value.value,
                    schema: blockSchema
                });
                return <HintTextView hint={text} />;
            }}
        </Observer>
    );
}



function Explanation({ vm }: QuestionFooterProps) {
    return (
        <Observer>
            {() => {
                if (vm.isEdit) {
                    return (
                        <ReusableRichEditorField
                            store={vm.storeRef}
                            label="Explanation"
                            placeholder="Enter explanation"
                            value={vm.ansExplanation.value}
                            refObj={vm.ansExplanation.ref}
                            schema={blockSchema}
                            onChange={node => vm.ansExplanation.value.set(node)}
                        />
                    );
                }
                const text = FormsComposerUtil.toTextOrEmpty({
                    doc: vm.ansExplanation.value.value,
                    schema: blockSchema
                });
                return <QuestionExplanationView explanation={text} />
            }}
        </Observer>
    );
}

type ReusableRichEditorFieldProps = {
    store: EditTranslationStore;
    label: string;
    placeholder: string;
    value: InputValue<FormsComposerDoc | null>;
    refObj: React.RefObject<FormsComposerEditorRef | null>;
    schema: FormsComposerSchema;
    onChange: (node: FormsComposerDoc) => void;
};

const ReusableRichEditorField: React.FC<ReusableRichEditorFieldProps> = ({
    store,
    label,
    placeholder,
    value,
    refObj,
    schema,
    onChange
}) => {

    useEffect(() => {
        const changeListener = (node: FormsComposerDoc) => {
            onChange(node);
        };
        const refCurrent = refObj.current;
        refCurrent?.addChangeListener(changeListener);
        return () => {
            refCurrent?.removeChangeListener(changeListener);
        };
    }, [refObj, onChange]);

    return (
        <FormsComposerField
            label={label}
            placeholder={placeholder}
            value={value}
            ref={refObj}
            schema={schema}
            options={store.blockComposerOptions}
        />
    );
};