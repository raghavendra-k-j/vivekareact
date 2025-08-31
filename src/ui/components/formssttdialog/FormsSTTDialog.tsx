import { FramedDialog } from "~/ui/widgets/dialogmanager";
import { FormsSTTDialogFooter } from "./comp/FormsSTTDialogFooter";
import { FormsSTTDialogBody } from "./comp/FormsSTTDialogBody";
import { FormsSTTDialogProvider } from "./FormSTTDialogProvider";
import { FormsSTTOptions } from "./models/FormatSTTOptions";
import { FormsSTTRes } from "~/domain/forms/stt/FormsSTTRes";

export type FormsSTTDialogProps = {
    options: FormsSTTOptions;
    onClose: () => void;
    onDone: (res: FormsSTTRes) => void;
};

export function FormsSTTDialog(props: FormsSTTDialogProps) {
    return (<FormsSTTDialogProvider
        options={props.options}
        onClose={props.onClose}
        onDone={props.onDone}>
        <Inner />
    </FormsSTTDialogProvider>);
}

function Inner() {
    return (
        <FramedDialog
            scaffoldClassName="p-4"
            contentClassName="w-full max-w-[420px] min-h-[360px] max-h-[720px] flex flex-col"
            onClose={() => { }}
        >
            <FormsSTTDialogBody />
            <FormsSTTDialogFooter />
        </FramedDialog>
    );
}