import { Button } from "~/ui/widgets/button/Button";
import { InputSourceCard } from "./InputSourceCommon";
import { FTextarea } from "~/ui/widgets/form/input/FTextArea";

export function PasteTextView() {
    return (<InputSourceCard>
        <div className="flex flex-col gap-4 w-full p-6">
            <FTextarea
                className="w-full"
                placeholder="Paste content here"
                rows={10}
            />
            <div className="flex justify-end">
                <Button color="primary">Next</Button>
            </div>
        </div>
    </InputSourceCard>);
}