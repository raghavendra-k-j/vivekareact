import { Observer } from "mobx-react-lite";
import { InputError } from "~/ui/widgets/form/InputError";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import { InputFieldContainer } from "~/ui/widgets/form/FFieldContainer";
import { TextEnAVm } from "./TextEnAVm";
import { FormsComposerEditor } from "~/ui/components/formscomposer/FormsComposerEditor";
import { blockSchema, inlineSchema } from "~/ui/components/formscomposer/core/schema";

export function TextEnAView(vm: TextEnAVm) {
    return (
        <Observer>
            {() => {
                if (vm.storeRef.vm.scorable.value.isNotTrue) {
                    return null;
                }
                return (
                    <div>
                        <InputFieldContainer>
                            <InputLabel>Answer</InputLabel>
                            <FormsComposerEditor
                                placeholder="Enter Correct Answer"
                                ref={vm.editorRef}
                                initialContent={vm.node}
                                schema={vm.type.isTextBox ? inlineSchema : blockSchema}
                                minHeight={vm.type.isTextArea ? "80px" : ""}
                                options={vm.type.isTextBox ? vm.storeRef.inlineComposerOptions : vm.storeRef.blockComposerOptions}
                            />
                            <InputError></InputError>
                        </InputFieldContainer>
                    </div>
                );
            }}
        </Observer>
    );
}