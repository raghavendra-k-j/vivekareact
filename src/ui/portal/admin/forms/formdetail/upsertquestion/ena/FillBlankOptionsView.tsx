import OutlinedButton, { Button } from "~/ui/widgets/button/Button";
import { FillBlankOptions } from "./QuestionOptions";

export function FillBlankOptionsView(vm: FillBlankOptions) {
    return (
        <div className="flex flex-start">
            <Button variant="outline" color="secondary" size="sm" onClick={() => vm.handleAddBlank()}>
                Add Blank
            </Button>
        </div>
    );
}