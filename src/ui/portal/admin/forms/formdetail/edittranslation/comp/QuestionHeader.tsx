import { QuestionTypeBadge } from "~/ui/components/question/QuestionBadges";
import { QuestionVm } from "../models/QuestionVm";
import { QuestionText } from "~/ui/components/form/commons/QuestionText";
import { Observer } from "mobx-react-lite";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { Check, Edit } from "lucide-react";
import { QNumberUtil } from "~/domain/forms/utils/QNumberUtil";
import { useEffect } from "react";
import { FormsComposerField } from "~/ui/components/formscomposer/FormsComposerEditorField";
import { blockSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";

export type QuestionHeaderProps = {
    vm: QuestionVm;
};

export function QuestionHeader({ vm }: QuestionHeaderProps) {
    return (
        <div className="flex flex-col px-6 gap-2">
            <HeaderTopBar vm={vm} />
            <QuestionContent vm={vm} />
        </div>
    );
}


function HeaderTopBar({ vm }: QuestionHeaderProps) {
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="space-y-1">
                <div className="text-sm text-secondary font-semibold">
                    Question {QNumberUtil.getQNumber(vm.qNumber, vm.subQNumber)} of {vm.storeRef.fd.totalQuestions}
                </div>
                <div className="flex items-center gap-2">
                    <QuestionTypeBadge type={vm.type.getName(vm.storeRef.formType)} />
                </div>
            </div>
            <EditToggleButton vm={vm} />
        </div>
    );
}



function EditToggleButton({ vm }: QuestionHeaderProps) {
    return (
        <Observer>
            {() =>
                vm.isEdit ? (
                    <IconButton
                        size="sm"
                        variant="soft"
                        color="success"
                        onClick={() => vm.toggleEdit()}
                        icon={<Check size={16} />}
                    />
                ) : (
                    <IconButton
                        size="sm"
                        variant="ghost"
                        color="secondary"
                        onClick={() => vm.toggleEdit()}
                        icon={<Edit size={16} />}
                    />
                )
            }
        </Observer>
    );
}


function QuestionContent({ vm }: QuestionHeaderProps) {
    return (
        <Observer>
            {() => (vm.isEdit ? <EditQuestionHeader vm={vm} /> : <ReadQuestionHeader vm={vm} />)}
        </Observer>
    );
}


function ReadQuestionHeader({ vm }: QuestionHeaderProps) {
    return <div>
        <QuestionText
            question={FormsComposerUtil.toTextOrEmpty({ doc: vm.question.value.value, schema: blockSchema })}
        />
    </div>;
}

function EditQuestionHeader({ vm }: QuestionHeaderProps) {

    useEffect(() => {
        const changeListener = (node: FormsComposerDoc) => {
            vm.question.value.set(node);
        };
        vm.question.ref.current?.addChangeListener(changeListener);
        return () => {
            vm.question.ref.current?.removeChangeListener(changeListener);
        };
    }, [vm.question.ref, vm.question.value]);

    return <FormsComposerField
        label="Question"
        value={vm.question.value}
        ref={vm.question.ref}
        placeholder="Enter Question"
        schema={blockSchema}
        options={vm.storeRef.blockComposerOptions}
    />;
}
