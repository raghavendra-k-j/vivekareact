import { action, makeObservable, observable } from "mobx";
import { FFieldContainer } from "~/ui/widgets/form/input/FFieldContainer";
import { FError } from "~/ui/widgets/form/FError";
import React, { createRef, useEffect } from "react";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { Observer } from "mobx-react-lite";
import { UUIDUtil } from "~/core/utils/UUIDUtil";
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { FaSquareCheck, FaCircleCheck } from "react-icons/fa6";
import { Trash2 } from "lucide-react";
import { FormsComposerEditor, FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { UpsertQuestionStore } from "../UpsertQuestionStore";

export type ChoiceEnAVmProps = {
    selected: boolean;
    doc: ProseMirrorNode | null;
}

export class ChoiceEnAVm {
    uid: string = UUIDUtil.compact;
    ref: React.RefObject<FormsComposerEditorRef | null>;
    selected: boolean | null;
    doc: ProseMirrorNode | null;

    constructor(props: ChoiceEnAVmProps) {
        this.ref = createRef<FormsComposerEditorRef | null>();
        this.selected = props.selected;
        this.doc = props.doc;
        makeObservable(this, {
            selected: observable,
            onNodeChanged: observable,
            setSelected: action,
        });
    }

    onNodeChanged(node: ProseMirrorNode | null) {
        this.doc = node;
    }

    setSelected(selected: boolean) {
        this.selected = selected;
    }

}

function ControlInputIcon({ isMultiple, selected, onClick }: { isMultiple: boolean, selected: boolean, onClick: () => void }) {
    const Icon = isMultiple
        ? selected
            ? FaSquareCheck
            : FaRegSquare
        : selected
            ? FaCircleCheck
            : FaRegCircle;

    const iconColor = selected ? "text-success" : "text-tertiary";
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-center p-1 focus:outline-none"
            aria-pressed={selected}
        >
            <Icon size={20} className={iconColor} />
        </button>
    );
}

export type ChoiceEnAViewProps = {
    store: UpsertQuestionStore;
    vm: ChoiceEnAVm;
    isCheckbox: boolean;
    index: number;
    scorable: boolean;
    choicesLength: number;
    onClickControl: (index: number) => void;
    onClickRemove?: (index: number) => void;
    placeholder: (index: number) => string;
}

export function ChoiceEnAView(props: ChoiceEnAViewProps) {
    useEffect(() => {
        const editor = props.vm.ref.current;
        if (!editor) return;

        const handleNodeChange = (node: ProseMirrorNode | null) => {
            props.vm.onNodeChanged(node);
        };

        editor.addChangeListener(handleNodeChange);
        return () => {
            editor.removeChangeListener(handleNodeChange);
        };
    }, [props.vm]);

    return (
        <FFieldContainer>
            <div className="flex flex-row items-center gap-2">

                {/* Control */}
                <Observer>
                    {() => {
                        if (!props.scorable) return null;
                        return (
                            <ControlInputIcon
                                isMultiple={props.isCheckbox}
                                selected={props.vm.selected ?? false}
                                onClick={() => props.onClickControl(props.index)}
                            />
                        );
                    }}
                </Observer>

                {/* Editor  */}
                <div className="flex-1">
                    <FormsComposerEditor
                        ref={props.vm.ref}
                        placeholder={props.placeholder(props.index)}
                        schema={inlineSchema}
                        initialContent={props.vm.doc}
                        options={props.store.inlineComposerOptions}
                    />
                </div>

                {/* Remove Button */}
                {props.onClickRemove && props.choicesLength > 2 && (
                    <RemoveIcon
                        onClick={() => props.onClickRemove?.(props.index)}
                    />
                )}

            </div>
            <FError />
        </FFieldContainer>
    );
}

function RemoveIcon({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="ml-2 text-error"
            title="Remove choice"
        >
            <Trash2 size={16} />
        </button>
    );
}
