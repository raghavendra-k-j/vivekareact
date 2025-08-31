import { TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { logger } from "~/core/utils/logger";
import { DocSTTRes, FormsSTTRes } from "~/domain/forms/stt/FormsSTTRes";
import { DialogEntry, DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { FormsSTTDialog, FormsSTTDialogProps } from "../../formssttdialog/FormsSTTDialog";
import { FormsSTTOptions } from "../../formssttdialog/models/FormatSTTOptions";
import { blockSchema, FormsComposerSchema } from "../core/schema";
import { DocSTTRes2Node } from "../utils/DocSTTRes2Node";
import { focusEditor } from "./common";

export function insertSTTRes(view: EditorView, res: DocSTTRes, schema: FormsComposerSchema) {
    const fragmentToInsert = DocSTTRes2Node.convert(res, schema);

    if (fragmentToInsert.size === 0) {
        logger.warn("Converted Fragment is empty");
        focusEditor(view);
        return;
    }

    const { state, dispatch } = view;
    let { from, to } = state.selection;
    let { tr } = state;

    if (schema === blockSchema) {
        // Check if the selection's parent node is a paragraph and is empty
        const { $from } = state.selection;
        const parent = $from.parent;
        if (parent.isTextblock && parent.content.size === 0) {
            // If it's an empty paragraph, adjust 'from' to the start of that paragraph
            const startOfParent = $from.before($from.depth);
            from = startOfParent;
        }
    }


    tr = tr.deleteRange(from, to);
    let insertPos = from;

    fragmentToInsert.forEach(node => {
        tr = tr.insert(insertPos, node);
        insertPos += node.nodeSize;
    });

    const newSelection = TextSelection.near(tr.doc.resolve(insertPos), -1);

    tr = tr.setSelection(newSelection);
    dispatch(tr);
    focusEditor(view);
}

export type OnClickVoiceButtonProps = {
    view: EditorView | null;
    dialogManager: DialogManagerStore;
    schema: FormsComposerSchema;
    options: FormsSTTOptions;
}

export function onClickVoiceButton(props: OnClickVoiceButtonProps) {
    const { view, dialogManager, schema, options } = props;
    if (!view) {
        logger.error("EditorView is not available");
        return;
    }
    const dialogId = 'forms-stt-dialog';

    const entry: DialogEntry<FormsSTTDialogProps> = {
        id: dialogId,
        component: FormsSTTDialog,
        props: {
            options: options,
            onClose: () => {
                dialogManager.closeById(dialogId);
            },
            onDone: (res: FormsSTTRes) => {
                 dialogManager.closeById(dialogId);
                insertSTTRes(view, res.asDoc, schema);
            }
        }
    };

    dialogManager.show(entry);
};