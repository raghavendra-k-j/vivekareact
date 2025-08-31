import { NodeSpec, Schema } from "prosemirror-model";
import { FormsComposerConst } from "~/domain/forms/const/FormComposerConst";

export type FormsComposerInlineSchema = typeof inlineSchema;
export type FormsComposerBlockSchema = typeof blockSchema;
export type FormsComposerSchema = FormsComposerBlockSchema | FormsComposerInlineSchema;


const paragraph: NodeSpec = {
    group: "block",
    content: "inline*",
    parseDOM: [{ tag: "p" }],
    toDOM() { return ["p", 0]; }
};

const text: NodeSpec = {
    group: "inline"
};

const inlineLaTex: NodeSpec = {
    group: "inline",
    inline: true,
    atom: true,
    attrs: {
        latex: { default: "" }
    },
    toDOM(node) {
        return [
            "span",
            { "data-tag-ilatex": node.attrs.latex },
            node.attrs.latex
        ];
    },
    parseDOM: [{
        tag: "span[data-tag-ilatex]",
        getAttrs(dom) {
            return {
                latex: (dom as HTMLElement).getAttribute("data-tag-ilatex")
            };
        }
    }],

};


const blockLaTex: NodeSpec = {
    group: "block",
    atom: true,
    attrs: {
        latex: { default: "" }
    },
    toDOM(node) {
        return [
            "div",
            { "data-tag-blatex": node.attrs.latex, },
            node.attrs.latex
        ];
    },
    parseDOM: [{
        tag: "div[data-tag-blatex]",
        getAttrs(dom) {
            return {
                latex: (dom as HTMLElement).getAttribute("data-tag-blatex")
            };
        }
    }]
};


const fillBlank: NodeSpec = {
    group: "inline",
    inline: true,
    atom: true,
    attrs: {},
    toDOM() {
        return ["span", { "data-tag-fill-blank": "" }, FormsComposerConst.fillBlankUnderline];
    },
    parseDOM: [{
        tag: "span[data-tag-fill-blank]",
        getAttrs() {
            return {};
        }
    }]
};

export const blockSchema = new Schema({
    nodes: {
        doc: {
            content: "block+"
        },
        paragraph,
        text,
        latex: inlineLaTex,
        blockLatex: blockLaTex,
        fillBlank,
    }
});

export const inlineSchema = new Schema({
    nodes: {
        doc: {
            content: "paragraph"
        },
        paragraph,
        text,
        latex: inlineLaTex
    }
});
