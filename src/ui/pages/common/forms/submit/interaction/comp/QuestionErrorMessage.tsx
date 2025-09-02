import { Observer } from "mobx-react-lite";
import { InputError } from "~/ui/widgets/form/InputError";
import { QuestionVm } from "../models/QuestionVm";

export function QuestionErrorMessage({ vm }: { vm: QuestionVm}) {
    return (
        <Observer>
            {() => {
                if(!vm.base.error) {
                    return null;
                }
                return <InputError className="mt-1">{vm.base.error}</InputError>;
            }}
        </Observer>
    );
}