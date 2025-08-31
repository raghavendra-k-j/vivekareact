import { useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { useUpsertQuestionStore } from "./UpsertQuestionContext";
import { FListBoxField } from "~/ui/widgets/form/input/FListBoxField";
import { FCheckbox } from "~/ui/widgets/form/checkbox/FCheckbox";
import { FTextField } from "~/ui/widgets/form/input/FTextField";
import { FLabel } from "~/ui/widgets/form/FLabel";
import { FFieldContainer } from "~/ui/widgets/form/input/FFieldContainer";
import { FError } from "~/ui/widgets/form/FError";
import { QuestionType } from "~/domain/forms/models/question/QuestionType";
import { QuestionLevel } from "~/domain/forms/models/question/QuestionLevel";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { FReqMark } from "~/ui/widgets/form/FReqMark";
import { QuestionTextOptions } from "./QuestionTextOptions";
import { FormsComposerEditor } from "~/ui/components/formscomposer/FormsComposerEditor";
import { blockSchema } from "~/ui/components/formscomposer/core/schema";


export function UpsertQuestionForm() {
    const store = useUpsertQuestionStore();
    return (
        <div className="flex flex-1 flex-col p-6 gap-4 overflow-y-auto overflow-x-hidden bg-slate-50 max-w-full">
            {!store.isEdit && <QuestionTypeSelector />}
            <QuestionDetailsSection />
        </div>
    );
}

function QuestionTypeSelector() {
    const store = useUpsertQuestionStore();
    return (
        <FListBoxField<QuestionType | null>
            required={true}
            label="Question Type"
            placeholder="Select Question Type"
            itemKey={(item) => item!.type}
            onValueChange={(item) => store.onQuestionTypeChanged(item!)}
            itemRenderer={(item) => (<div className="flex flex-row items-center gap-4">
                {item!.getName(store.formType)}
            </div>)}
            buttonRenderer={(item) => item!.getName(store.formType)}
            items={store.questionTypes}
            field={store.vm.type}
        />
    );
}

function QuestionDetailsSection() {
    return (
        <div className="flex flex-col gap-4">
            <ScorableCheckbox />
            <QuestionSection />
            <MarksAndLevelSection />
            <EnaSection />
            <RequiredCheckbox />
            <HintAndExplanationSection />
        </div>
    );
}

function ScorableCheckbox() {
    const store = useUpsertQuestionStore();
    if (!store.vm.showScorable) return null;
    return (
        <div>
            <Observer>
                {() => (
                    <FCheckbox
                        onChange={(v) => store.vm.onChangeScorable(v)}
                        label="Scorable"
                        value={store.vm.scorable.value.boolValue!}
                    />
                )}
            </Observer>
        </div>
    );
}

function QuestionSection() {
    const store = useUpsertQuestionStore();
    const { vm } = store;

    useEffect(() => {
        const textEditor = vm.questionTextRef.current;
        function onQuestionChanged(node: ProseMirrorNode | null) {
            vm.onQuestionNodeChange(node);
        }
        textEditor?.addChangeListener(onQuestionChanged);
        return () => {
            textEditor?.removeChangeListener(onQuestionChanged);
        };
    }, [vm]);

    return (
        <div className="flex flex-col gap-2">
            <FFieldContainer>
                <FLabel>Question <FReqMark /></FLabel>
                <FormsComposerEditor
                    ref={vm.questionTextRef}
                    placeholder="Enter Question"
                    schema={blockSchema}
                    initialContent={vm.questionNode}
                    minHeight="80px"
                    maxHeight="120px"
                    options={store.blockComposerOptions}
                />
                <FError />
                <QuestionTextOptions />
            </FFieldContainer>

        </div>
    );
}


function MarksAndLevelSection() {
    const store = useUpsertQuestionStore();
    return (
        <Observer>
            {() =>
                store.vm.scorable.value.isNotTrue ? null : (
                    <div className="flex flex-row gap-4">
                        <FListBoxField<QuestionLevel | null>
                            required
                            className="flex-1"
                            label="Level"
                            placeholder="Select Level"
                            itemKey={(item) => (item ? item.level : "null")}
                            itemRenderer={(item) => (item ? item.name : "Select Level")}
                            buttonRenderer={(item) => (item ? item.name : "Select Level")}
                            items={QuestionLevel.values}
                            field={store.vm.level}
                            onValueChange={(value) => store.vm.onChangeLevel(value)}
                        />
                        <FTextField
                            label="Marks"
                            required={true}
                            placeholder="Enter Marks"
                            field={store.vm.marks}
                            type="number"
                            className="flex-1"
                        />
                    </div>
                )
            }
        </Observer>
    );
}

function EnaSection() {
    const store = useUpsertQuestionStore();
    return store.vm.enaVm ? store.vm.enaVm.render() : null;
}

function HintAndExplanationSection() {
    const store = useUpsertQuestionStore();

    useEffect(() => {
        const hintEditor = store.vm.ansHintRef.current;
        const explanationEditor = store.vm.ansExplanationRef.current;

        function onHintChanged(node: ProseMirrorNode | null) {
            store.vm.onAnsHintNodeChange(node);
        }
        function onExplanationChanged(node: ProseMirrorNode | null) {
            store.vm.onAnsExplanationNodeChange(node);
        }

        hintEditor?.addChangeListener(onHintChanged);
        explanationEditor?.addChangeListener(onExplanationChanged);

        return () => {
            hintEditor?.removeChangeListener(onHintChanged);
            explanationEditor?.removeChangeListener(onExplanationChanged);
        };
    }, [store.vm]);

    return (
        <Observer>
            {() => {
                if (store.vm.scorable.value.isNotTrue) return null;
                return (
                    <>
                        <FFieldContainer>
                            <FLabel>Answer Hint</FLabel>
                            <FormsComposerEditor
                                ref={store.vm.ansHintRef}
                                placeholder="Enter Answer Hint"
                                schema={blockSchema}
                                initialContent={store.vm.ansHintNode}
                                maxHeight="100px"
                                options={store.blockComposerOptions}
                            />
                            <FError />
                        </FFieldContainer>
                        <FFieldContainer>
                            <FLabel>Answer Explanation</FLabel>
                            <FormsComposerEditor
                                ref={store.vm.ansExplanationRef}
                                placeholder="Enter Answer Explanation"
                                schema={blockSchema}
                                initialContent={store.vm.ansExplanationNode}
                                minHeight="80px"
                                maxHeight="120px"
                                options={store.blockComposerOptions}
                            />
                            <FError />
                        </FFieldContainer>
                    </>
                );
            }}
        </Observer>
    );
}

function RequiredCheckbox() {
    const store = useUpsertQuestionStore();
    return store.vm.isRequired.value.isNotNone ? (
        <div className="bg-surface mt-5 rounded-sm border border-default px-3 py-2 shadow-xs">
            <Observer>
                {() => (
                    <FCheckbox
                        onChange={(value) => store.vm.onRequiredChange(value)}
                        label={<div className="ms-1">
                            <div>Make this question required</div>
                            <div className="text-xs text-secondary">
                                Users won’t be able to submit the form without answering this question.
                            </div>
                        </div>}
                        value={store.vm.isRequired.value.boolValue!}
                    />
                )}
            </Observer>
        </div>
    ) : null;
}
