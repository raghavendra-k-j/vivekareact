import { UUIDUtil } from "~/core/utils/UUIDUtil";
import { Paragraph as AiFormatResParagraph, Span, SpanType } from "~/domain/forms/stt/AiFormatSTTModels";


export enum TextRunType {
    TEXT = "text",
    LATEX = "latex",
}

export class TextRun {
    uuid: string = UUIDUtil.compact;
    type: TextRunType;
    content: string;

    constructor({ type, content }: { type: TextRunType; content: string }) {
        this.type = type;
        this.content = content;
    }

    static latex(latex: string): TextRun {
        return new TextRun({ type: TextRunType.LATEX, content: latex });
    }

    static text(text: string): TextRun {
        return new TextRun({ type: TextRunType.TEXT, content: text });
    }

    get isEmpty(): boolean {
        return this.content.trim() === "";
    }

    static fromSpan(span: Span): TextRun {
        if (span.type === SpanType.LATEX) {
            return TextRun.latex(span.content);
        } else {
            return TextRun.text(span.content);
        }
    }
}

export class Paragraph {

    uuid: string = UUIDUtil.compact;
    runs: TextRun[];

    constructor({ runs = [] }: { runs?: TextRun[] } = {}) {
        this.runs = runs;
    }

    addRun(run: TextRun): void {
        this.runs.push(run);
    }

    removeRun(uuid: string): void {
        this.runs = this.runs.filter(run => run.uuid !== uuid);
    }

    static text(text: string): Paragraph {
        const run = TextRun.text(text);
        return new Paragraph({ runs: [run], });
    }

    get isEmpty(): boolean {
        return this.runs.length === 0 || this.runs.every(run => run.content.trim() === "");
    }

    merge(paragraph: Paragraph) {
        this.runs.push(...paragraph.runs);
    }

    shallowCopy() {
        return new Paragraph({ runs: [...this.runs] });
    }

    static fromAiFormatParagraph(p: AiFormatResParagraph): Paragraph {
        const runs = p.spans.map(span => TextRun.fromSpan(span));
        return new Paragraph({ runs });
    }
}


export enum FormsSTTResType {
    LATEX = "latex",
    DOC = "doc",
}

export abstract class FormsSTTRes {
    abstract get isEmpty(): boolean;
    get isNotEmpty(): boolean {
        return !this.isEmpty;
    }
    abstract clear(): void;

    get isLatex(): boolean {
        return this instanceof LatexSTTRes;
    }

    get isDoc(): boolean {
        return this instanceof DocSTTRes;
    }

    get asDoc(): DocSTTRes {
        return this as unknown as DocSTTRes;
    }

    get asLatex(): LatexSTTRes {
        return this as unknown as LatexSTTRes;
    }

}

export class LatexSTTRes extends FormsSTTRes {

    latex: string;

    constructor(latex: string) {
        super();
        this.latex = latex;
    }

    get isEmpty(): boolean {
        return this.latex.trim() === "";
    }

    clear(): void {
        this.latex = "";
    }

    static newEmpty(): LatexSTTRes {
        return new LatexSTTRes("");
    }
}

export class DocSTTRes extends FormsSTTRes {

    paragraphs: Paragraph[];
    constructor(paragraphs: Paragraph[]) {
        super();
        this.paragraphs = paragraphs;
    }

    get isEmpty(): boolean {
        return this.paragraphs.length === 0 || this.paragraphs.every(p => p.runs.length === 0);
    }

    toMarkdown(): string {
        const strList: string[] = [];
        for (const paragraph of this.paragraphs) {
            const runList: string[] = [];
            for (const run of paragraph.runs) {
                if (run.type === TextRunType.LATEX) {
                    runList.push(`$${run.content}$`);
                } else {
                    runList.push(run.content);
                }
            }
            strList.push(runList.join(""));
        }
        return strList.join("\n\n");
    }

    toPlainText(): string {
        return this.paragraphs
            .map(paragraph => paragraph.runs.map(run => run.content).join(""))
            .join("\n\n");
    }

    clear(): void {
        this.paragraphs = [];
    }

    addParagraph(paragraph: Paragraph): void {
        this.paragraphs.push(paragraph);
    }

    removeParagraph(uuid: string): void {
        this.paragraphs = this.paragraphs.filter(paragraph => paragraph.uuid !== uuid);
    }

    static newEmpty(): DocSTTRes {
        return new DocSTTRes([]);
    }
}