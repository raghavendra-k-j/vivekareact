import { baseKeymap } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Node as ProseMirrorNode } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { onClickEquationNode } from "./commands/latex";
import { FormsComposerProps } from "./FormsComposerEditor";
import { FillBlankNodeView } from "./nodes/FillBlankNodeView";
import { LaTexNodeView } from "./nodes/LaTexNodeView";
import { placeholderPlugin } from "./plugins/placeholderPlugin";

export type CreateViewProps = {
    instanceId: string;
    composerProps: FormsComposerProps;
    editorRef: React.RefObject<HTMLDivElement | null>;
    viewRef: React.RefObject<EditorView | null>;
    state: EditorState;
    dialogManager: DialogManagerStore;
    changeListeners: React.RefObject<Set<(doc: ProseMirrorNode) => void>>;
};

export function createView(props: CreateViewProps) {
    return new EditorView(props.editorRef.current, {
        state: props.state,
        dispatchTransaction: (transaction) => {
            if (!props.viewRef.current) return;
            const newState = props.viewRef.current.state.apply(transaction);
            props.viewRef.current.updateState(newState);
            if (transaction.docChanged) {
                props.changeListeners.current?.forEach((listener) => {
                    listener(newState.doc);
                });
                if (props.composerProps.onChange) {
                    props.composerProps.onChange(newState.doc, props.instanceId);
                }
            }
        },
        nodeViews: {
            latex(node, viewInstance, getPos) {
                return new LaTexNodeView({
                    node: node,
                    view: viewInstance,
                    getPos: getPos,
                    onClick: (node) => onClickEquationNode({
                        node: node,
                        dialogManager: props.dialogManager,
                        enableStt: props.composerProps.options.equation?.enableStt || false,
                        sttOptions: props.composerProps.options.equation?.sttOptions || null,
                    }),
                    isInline: true,
                });
            },
            blockLatex(node, viewInstance, getPos) {
                return new LaTexNodeView({
                    node: node,
                    view: viewInstance,
                    getPos: getPos,
                    onClick: (node) => onClickEquationNode({
                        node: node,
                        dialogManager: props.dialogManager,
                        sttOptions: props.composerProps.options.equation?.sttOptions || null,
                        enableStt: props.composerProps.options.equation?.enableStt || false,
                    }),
                    isInline: false,
                });
            },
            fillBlank(node, viewInstance, getPos) {
                return new FillBlankNodeView({
                    node: node,
                    view: viewInstance,
                    getPos: getPos,
                });
            }
        },
        attributes: {
            class: 'richPmEditorContent'
        }
    });
}


export function createState(docNode: ProseMirrorNode | undefined, props: FormsComposerProps) {
    return EditorState.create({
        doc: docNode,
        schema: props.schema,
        plugins: [
            history(),
            keymap({ 'Mod-z': undo, 'Mod-y': redo }),
            keymap(baseKeymap),
            placeholderPlugin(props.placeholder || ""),
        ],
    });
}


export function handleInitData(props: FormsComposerProps) {
    let docNode: ProseMirrorNode | undefined = undefined;
    if (props.initialContent) {
        docNode = props.initialContent;
    }
    return docNode;
}

