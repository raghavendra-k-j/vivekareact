import DomPurify from "dompurify";
import { renderLatexToString } from "~/domain/latex/util/renderLatex";
import { DocSTTRes, Paragraph, TextRun, TextRunType } from "./FormsSTTRes";

export class FormsSTTRes2Html {


    static convertLaTex(latex: string): string {
        const html = renderLatexToString({
            latex: latex,
            displayMode: false
        });
        const span = document.createElement("span");
        span.innerHTML = DomPurify.sanitize(html || latex);
        return span.outerHTML;
    }

    public static convertDoc(contents: DocSTTRes): string {
        return contents.paragraphs
            .map(paragraph => this.convertParagraph(paragraph))
            .join("\n");
    }
    

    public static convertParagraph(paragraph: Paragraph): string {
        const htmlRuns = paragraph.runs
            .map(run => this.convertRun(run))
            .join(" ");
        return `<p>${htmlRuns}</p>`;
    }


    private static convertRun(run: TextRun): string {
        if (run.type === TextRunType.LATEX) {
            const katexHtml = renderLatexToString({
                latex: run.content,
                displayMode: false
            });
            return `<span>${katexHtml || run.content}</span>`;
        }
        else {
            return run.content;
        }
    }
}
