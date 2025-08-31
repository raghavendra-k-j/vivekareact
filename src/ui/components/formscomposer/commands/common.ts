import { Fragment, Node as ProseMirrorNode } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export function focusEditor(view: EditorView | null) {
    if (!view) return;
    setTimeout(() => {
        view.focus();
    }, 0);
}


export function shouldInsertSpaceBefore(state: EditorState, from: number): boolean {
    if (from === 0) return false;
    const prevChar = state.doc.textBetween(from - 1, from, '\uFFFC');
    const $pos = state.doc.resolve(from);
    return prevChar !== ' ' && $pos.parentOffset > 0;
}


export function calculateSelectionPosition(from: number, fragment: Fragment): number {
    return from + fragment.size;
}

export function setEditorContent(view: EditorView, doc: ProseMirrorNode) {
    const { state, dispatch } = view;
    const tr = state.tr.replaceWith(0, state.doc.content.size, doc);
    dispatch(tr);
    focusEditor(view);
}

export function getEditorContent(view: EditorView): ProseMirrorNode | null {
    return view.state.doc;
}

