import { EditorView } from "prosemirror-view";
import { Fragment, Node as PMNode } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";
import { FormsComposerSchema } from "../core/schema";
import { calculateSelectionPosition, shouldInsertSpaceBefore } from "./common";

export function insertBlankNode(view: EditorView, schema: FormsComposerSchema) {
    const fillBlankNodeType = schema.nodes.fillBlank;
    if (!fillBlankNodeType) {
        throw new Error("Fill Blank node type is not defined in the schema.");
    }

    const { state, dispatch } = view;
    const { from, to } = state.selection;
    let tr = state.tr;

    const insertSpaceBefore = shouldInsertSpaceBefore(state, from);
    const fragment = buildFillBlankFragment(schema, insertSpaceBefore);

    tr = tr.replaceWith(from, to, fragment);

    const selectionPos = calculateSelectionPosition(from, fragment);
    tr = tr.setSelection(TextSelection.create(tr.doc, selectionPos));

    dispatch(tr);
    view.focus();
}


function buildFillBlankFragment(schema: FormsComposerSchema, insertSpaceBefore: boolean): Fragment {
    const fillBlankNode = schema.nodes.fillBlank.create();
    const spaceNode = schema.text(" ");
    const nodes: PMNode[] = [];
    if (insertSpaceBefore) nodes.push(schema.text(" "));
    nodes.push(fillBlankNode);
    nodes.push(spaceNode);
    return Fragment.fromArray(nodes);
}

