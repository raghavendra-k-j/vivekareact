import { QuestionHeaderView } from "./QuestionHeaderView";
import { QuestionCardView } from "./QuestionCardView";
import { blockSchema, inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { TextQuestionVm } from "../models/TextQuestionVm";
import { GroupQuestionVm } from "../models/GroupQuestionVm";
import { FormsComposerEditor } from "~/ui/components/formscomposer/FormsComposerEditor";

type TextQuestionViewProps = {
    vm: TextQuestionVm;
    parentVm?: GroupQuestionVm;
};


export function TextQuestionView({ vm, parentVm }: TextQuestionViewProps) {
    return (
        <QuestionCardView parent={parentVm} >
            <QuestionHeaderView vm={vm} parentVm={parentVm} />
            <TextQuestionInput vm={vm} />
        </QuestionCardView>
    );
}


function TextQuestionInput({ vm }: { vm: TextQuestionVm }) {
    return (
        <div className="flex flex-row px-4 py-4 gap-4">
            <FormsComposerEditor
                schema={vm.isMultiline ? blockSchema : inlineSchema}
                onChange={(node) => vm.onAnsStrChanged(node)}
                placeholder="Type here..."
                minHeight={vm.isMultiline ? "80px" : ""}
                maxHeight="200px"
                options={vm.isMultiline ? vm.base.store.parentStore.blockComposerOptions : vm.base.store.parentStore.inlineComposerOptions}
            />
        </div>
    );
}