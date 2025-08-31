import { Observer } from "mobx-react-lite";
import { FError } from "~/ui/widgets/form/FError";
import { QuestionVm } from "../models/QuestionVm";

export function QuestionErrorMessage({ vm }: { vm: QuestionVm}) {
    return (
        <Observer>
            {() => {
                if(!vm.base.error) {
                    return null;
                }
                return <FError className="mt-1">{vm.base.error}</FError>;
            }}
        </Observer>
    );
}