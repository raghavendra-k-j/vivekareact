import 'katex/dist/katex.min.css';
import { EditorView, NodeView } from 'prosemirror-view';
import { FormsComposerConst } from '~/domain/forms/const/FormComposerConst';
import { renderLatex } from '~/domain/latex/util/renderLatex';
import { blockSchema } from '../core/schema';
import { FormsComposerDoc } from '../core/FormsComposeDoc';


type LaTexNodeViewProps = {
    node: FormsComposerDoc;
    view: EditorView;
    getPos: () => number | undefined;
    onClick: OnClickLaTexNodeView;
    isInline: boolean;
}

export type OnClickLaTexNodeView = (node: LaTexNodeView) => void;

export class LaTexNodeView implements NodeView {

    public dom: HTMLElement;
    private node: FormsComposerDoc;
    private view: EditorView;
    private getPos: () => number | undefined;
    private onClick: OnClickLaTexNodeView;
    private isInline: boolean;

    constructor(props: LaTexNodeViewProps) {
        this.node = props.node;
        this.view = props.view;
        this.getPos = props.getPos;
        this.onClick = props.onClick;
        this.isInline = props.isInline;
        this.dom = document.createElement(this.isInline ? 'span' : 'div');
        this.renderContent();
        this.dom.addEventListener('click', this.handleClick);
    }

    get getView(): EditorView {
        return this.view;
    }

    getLaTex() {
        return this.node.attrs.latex;
    }

    private renderContent(): void {
        const latexSource = this.node.attrs.latex || '';
        renderLatex({
            latex: latexSource,
            dom: this.dom,
            displayMode: !this.isInline
        });
        if (this.isInline) {
            this.dom.setAttribute(FormsComposerConst.inlineLaTexDataTag, latexSource);
        }
        else {
            this.dom.setAttribute(FormsComposerConst.blockLaTexDataTag, latexSource);
        }
        this.dom.title = `Click to Edit`;
    }

    private handleClick = (event: MouseEvent): void => {
        event.preventDefault();
        const pos = this.getPos();
        if (pos === undefined) return;
        this.onClick(this);
    };

    public update(node: FormsComposerDoc): boolean {
        if (node.type !== blockSchema.nodes.latex) {
            return false;
        }
        if (node.attrs.latex !== this.node.attrs.latex) {
            this.node = node;
            this.renderContent();
        }
        return true;
    }

    public updateLaTex(latex: string): void {
        const pos = this.getPos();
        if (pos === undefined) return;
        this.view.dispatch(this.view.state.tr.setNodeMarkup(pos, undefined, { latex }));
        this.renderContent();
    }

    public stopEvent(event: Event): boolean {
        return event instanceof MouseEvent && event.target === this.dom && !!this.onClick;
    }

    public destroy(): void {
        this.dom.removeEventListener('click', this.handleClick);
    }

    public ignoreMutation(mutation: globalThis.MutationRecord | { type: "selection"; target: Node }): boolean {
        if (mutation.type === "selection") {
            return false;
        }
        if (this.node.type.spec.atom) {
            const domMutation = mutation as globalThis.MutationRecord;
            if (this.dom.contains(domMutation.target)) {
                return true;
            }
        }
        return false;
    }
}