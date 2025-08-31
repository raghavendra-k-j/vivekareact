import { FormsComposerEditor } from "~/ui/components/formscomposer/FormsComposerEditor";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FillBlankItemVm, FillBlanksQuestionVm } from "../models/FillBlanksQuestionVm";
import { GroupQuestionVm } from "../models/GroupQuestionVm";
import { QuestionCardView } from "./QuestionCardView";
import { QuestionHeaderView } from "./QuestionHeaderView";

type FillBlanksQuestionViewProps = {
    vm: FillBlanksQuestionVm;
    parentVm?: GroupQuestionVm;
};

export const FillBlanksQuestionView = ({ vm, parentVm }: FillBlanksQuestionViewProps) => {
    return (
        <QuestionCardView parent={parentVm}>
            <QuestionHeaderView vm={vm} parentVm={parentVm} />
            <div className="space-y-4 px-4 py-4">
                {vm.items.map((item, index) =>
                    index > 10 ? null : (
                        <FillBlankInputView
                            key={item.input.id}
                            vm={vm}
                            itemVm={item}
                            position={index + 1}
                        />
                    )
                )}
            </div>
        </QuestionCardView>
    );
};

type InputProps = {
    vm: FillBlanksQuestionVm;
    itemVm: FillBlankItemVm;
    position: number;
};

const FillBlankInputView = ({ vm, itemVm, position: index }: InputProps) => {
    const placeholder = vm.items.length > 1 ? `Fill up answer ${index}` : "Fill up answer";
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                <FormsComposerEditor
                    schema={inlineSchema}
                    onChange={(node) => vm.onAnsStrChanged(itemVm, node)}
                    placeholder={placeholder}
                    options={vm.base.store.parentStore.inlineComposerOptions}
                />
            </div>
        </div>
    );
};
