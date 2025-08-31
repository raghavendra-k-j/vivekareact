import { Fragment } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { logger } from "~/core/utils/logger";
import { LaTexExpr } from "~/domain/latexkb/models/LaTexExpr";
import { DialogEntry, DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { FormsSTTLaTexOptions } from "../../formssttdialog/models/FormatSTTOptions";
import { LatexKb } from "../../LaTexKb/LaTexKb";
import { LaTexKbProps } from "../../LaTexKb/LaTexKbProvider";
import { FormsComposerSchema } from "../core/schema";
import { LaTexNodeView } from "../nodes/LaTexNodeView";

//#region Insert LaTeX Expression
export function insertLaTexExpr(view: EditorView, expr: LaTexExpr, schema: FormsComposerSchema) {
    const { state, dispatch } = view;
    const { from, to } = state.selection;
    let tr = state.tr;

    const insertSpaceBefore = shouldInsertSpaceBefore(state, from);

    if (expr.isInline) {
        const fragmentToInsert = createInlineLatexFragment(expr, schema, insertSpaceBefore);
        tr = tr.replaceWith(from, to, fragmentToInsert);
        const selectionPos = calculateSelectionPosition(from, fragmentToInsert);
        tr = tr.setSelection(TextSelection.create(tr.doc, selectionPos));
    } else {
        const fragmentToInsert = createBlockLatexFragment(expr, schema, insertSpaceBefore);
        tr = tr.replaceWith(from, to, fragmentToInsert);
        const selectionPos = calculateSelectionPosition(from, fragmentToInsert);
        tr = tr.setSelection(TextSelection.create(tr.doc, selectionPos));
    }

    dispatch(tr);
    view.focus();
}

function shouldInsertSpaceBefore(state: any, from: number): boolean {
    if (from > 0) {
        const prevChar = state.doc.textBetween(from - 1, from, '\uFFFC');
        if (prevChar !== ' ') {
            const $pos = state.doc.resolve(from);
            if ($pos.parentOffset > 0) {
                return true;
            }
        }
    }
    return false;
}

function createInlineLatexFragment(expr: LaTexExpr, schema: FormsComposerSchema, insertSpaceBefore: boolean): Fragment {
    const latexNodeType = schema.nodes.latex;
    if (!latexNodeType) {
        throw new Error("Inline LaTeX node type is not defined in the schema.");
    }

    const nodesToInsert = [];
    if (insertSpaceBefore) {
        nodesToInsert.push(schema.text(" "));
    }

    nodesToInsert.push(latexNodeType.create({ latex: expr.latex }));
    nodesToInsert.push(schema.text(" "));

    return Fragment.fromArray(nodesToInsert);
}

function createBlockLatexFragment(expr: LaTexExpr, schema: FormsComposerSchema, insertSpaceBefore: boolean): Fragment {
    const blockLatexNodeType = schema.nodes.blockLatex;
    const paragraphNodeType = schema.nodes.paragraph;

    if (!blockLatexNodeType) {
        throw new Error("Block LaTeX node type is not defined in the schema.");
    }
    if (!paragraphNodeType) {
        throw new Error("Paragraph node type is required after block-level insertion.");
    }

    const nodesToInsert = [];
    if (insertSpaceBefore) {
        nodesToInsert.push(schema.text(" "));
    }

    nodesToInsert.push(blockLatexNodeType.create({ latex: expr.latex }));

    const paragraphNode = paragraphNodeType.createAndFill();
    if (paragraphNode) {
        nodesToInsert.push(paragraphNode);
    }

    return Fragment.fromArray(nodesToInsert);
}

function calculateSelectionPosition(from: number, fragment: Fragment): number {
    const insertedSize = fragment.content.reduce((acc, node) => acc + node.nodeSize, 0);
    return from + insertedSize;
}
//#endregion



type ShowLaTexDialogProps = {
    dialogManager: DialogManagerStore;
    dialogId: string;
    expr: LaTexExpr | null;
    onDone: (expr: LaTexExpr) => void;
    enableStt: boolean;
    sttOptions: FormsSTTLaTexOptions | null;
}

function showLatexDialog(props: ShowLaTexDialogProps) {
    const { dialogManager, dialogId, expr, onDone, sttOptions } = props
    const dialogEntry: DialogEntry<LaTexKbProps> = {
        id: dialogId,
        component: LatexKb,
        props: {
            expr: expr,
            onDone: (expr) => {
                onDone(expr);
                dialogManager.closeById(dialogId);
            },
            onClose: () => dialogManager.closeById(dialogId),
            enableStt: props.enableStt,
            sttOptions: sttOptions,
        }
    };
    dialogManager.show(dialogEntry);
}



export type OpenNewEquationDialogProps = {
    view: EditorView | null;
    dialogManager: DialogManagerStore;
    schema: FormsComposerSchema;
    enableStt: boolean;
    sttOptions: FormsSTTLaTexOptions | null;
};

export function openNewEquationDialog(props: OpenNewEquationDialogProps) {
    const { view, dialogManager, schema, sttOptions, enableStt } = props;
    if (!view) {
        logger.warn("EditorView is not available for LaTeX insertion.");
        return;
    }

    const dialogId = 'forms-composer-latex-kb-dialog';
    showLatexDialog({
        expr: null,
        dialogManager: dialogManager,
        dialogId: dialogId,
        onDone: (expr) => insertLaTexExpr(view, expr, schema),
        sttOptions: sttOptions,
        enableStt: enableStt,
    });
}

export type OnClickEquationNodeProps = {
    node: LaTexNodeView;
    dialogManager: DialogManagerStore;
    enableStt: boolean;
    sttOptions: FormsSTTLaTexOptions | null;
};

export const onClickEquationNode = (props: OnClickEquationNodeProps) => {
    const { node, dialogManager, sttOptions } = props;
    const latex = node.getLaTex();
    const dialogId = 'forms-composer-latex-kb-editor-dialog';
    showLatexDialog({
        dialogManager,
        dialogId,
        expr: new LaTexExpr({ latex }),
        onDone: (expr) => {
            node.updateLaTex(expr.latex);
            node.getView.focus();
        },
        sttOptions: sttOptions,
        enableStt: props.enableStt,
    });
};