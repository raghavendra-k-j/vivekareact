import { EditorView, NodeView } from 'prosemirror-view';
import { FormsComposerDoc } from '../core/FormsComposeDoc';
import { FormsComposerConst } from '~/domain/forms/const/FormComposerConst';

type FillBlankNodeViewProps = {
    node: FormsComposerDoc;
    view: EditorView;
    getPos: () => number | undefined;
};

export class FillBlankNodeView implements NodeView {

    public dom: HTMLElement;
    private node: FormsComposerDoc;

    constructor(props: FillBlankNodeViewProps) {
        this.node = props.node;
        this.dom = document.createElement('span');
        this.dom.setAttribute(FormsComposerConst.fillBlankDataTag, '');
        this.dom.textContent = FormsComposerConst.fillBlankUnderline;
    }

    public update(node: FormsComposerDoc): boolean {
        return node.type === this.node.type;
    }

    public stopEvent(): boolean {
        return false;
    }

    public destroy(): void {

    }

    public ignoreMutation(mutation: MutationRecord | { type: "selection"; target: Node }): boolean {
        if (mutation.type === "selection") {
            return false;
        }
        return true;
    }
}
