import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import { FillBlankEnAVm } from "./FillBlankEnAVm";
import { FillBlankEnAVmItem } from "./FillBlankEnAVmItem";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { FormsComposerEditor } from "~/ui/components/formscomposer/FormsComposerEditor";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";

export function FillBlankEnAVmView(vm: FillBlankEnAVm) {
    return (
        <Observer>
            {() =>
                vm.storeRef.vm.scorable.value.isNotTrue ? null : (
                    <>
                        {vm.items.map((item, index) => (
                            <FillBlankInputView
                                key={item.uid}
                                vm={vm}
                                item={item}
                                index={index}
                            />
                        ))}
                    </>
                )
            }
        </Observer>
    );
}


type FillBlankInputProps = {
    vm: FillBlankEnAVm;
    item: FillBlankEnAVmItem;
    index: number;
};

function FillBlankInputView(props: FillBlankInputProps) {
    useEffect(() => {
        const editor = props.item.ref.current;
        if (!editor) return;
        function handleNodeChange(node: ProseMirrorNode | null) {
            props.item.onNodeChanged(node);
        }
        editor.addChangeListener(handleNodeChange);
        return () => {
            editor.removeChangeListener(handleNodeChange);
        };
    }, [props]);

    const placeholder = `Fill up ${props.index + 1} answer`;

    return (
        <div>
            <FormsComposerEditor
                ref={props.item.ref}
                schema={inlineSchema}
                initialContent={props.item.node}
                placeholder={placeholder}
                options={props.vm.storeRef.inlineComposerOptions}
            />
        </div>
    );
}