import DOMPurify from 'dompurify';
import { renderLatexToString } from "~/domain/latex/util/renderLatex";
import { FormsComposerConst } from "~/domain/forms/const/FormComposerConst";


/* 
Markdown Question Renderer
- Handles rendering of inline and block LaTeX expressions
- Replaces fill-in-the-blank spans with underscores
- Sanitizes HTML to prevent XSS attacks
*/

export class MdQRenderer {

    private static domParser = new DOMParser();

    static renderInline(text: string): string {
        const doc = this.domParser.parseFromString(text, 'text/html');

        // Replace blanks: <span data-tag-fill-blank></span>
        const blanks = doc.querySelectorAll(`[${FormsComposerConst.fillBlankDataTag}]`);
        blanks.forEach(blank => {
            const underline = FormsComposerConst.fillBlankUnderline;
            const textNode = document.createTextNode(underline);
            blank.replaceWith(textNode);
        });

        // Replace inline LaTeX: <span data-tag-ilatex="..."></span>
        const inlineSpans = doc.querySelectorAll(`[${FormsComposerConst.inlineLaTexDataTag}]`);
        inlineSpans.forEach(span => {
            const latex = span.getAttribute(FormsComposerConst.inlineLaTexDataTag) || '';

            // Render the LaTeX to a string
            const renderLaTexString = renderLatexToString({
                latex: latex,
                displayMode: false
            });

            // Set the rendered LaTeX as the innerHTML of the span
            if (renderLaTexString) {
                const temp = document.createElement('span');
                temp.innerHTML = renderLaTexString;
                span.replaceWith(...Array.from(temp.childNodes));
            }
        });

        return DOMPurify.sanitize(doc.body.innerHTML);
    }


    static renderBlock(text: string): string {
        // 1. Parse the string into a DOM
        const doc = this.domParser.parseFromString(text, 'text/html');

        // 2. Replace inline LaTeX spans
        const inlineSpans = doc.querySelectorAll(`[${FormsComposerConst.inlineLaTexDataTag}]`);
        inlineSpans.forEach(span => {
            const latex = span.getAttribute(FormsComposerConst.inlineLaTexDataTag) || '';
            const rendered = renderLatexToString({
                latex: latex,
                displayMode: false,
            })!;

            // Replace the entire span content with rendered HTML
            // Here we can either replace innerHTML or replace the whole element
            // To avoid nested tags issues, replace the whole span element
            const temp = document.createElement('span');
            temp.innerHTML = rendered;
            span.replaceWith(...Array.from(temp.childNodes));
        });

        // 3. Replace block LaTeX divs
        const blockDivs = doc.querySelectorAll(`[${FormsComposerConst.blockLaTexDataTag}]`);
        blockDivs.forEach(div => {
            const latex = div.getAttribute(FormsComposerConst.blockLaTexDataTag) || '';

            const rendered = renderLatexToString({
                latex: latex,
                displayMode: true,
            })!;

            const temp = document.createElement('div');
            temp.innerHTML = rendered;
            div.replaceWith(...Array.from(temp.childNodes));
        });

        // 4. Replace blanks spans/divs with underscore strings or desired content
        const blanks = doc.querySelectorAll(`[${FormsComposerConst.fillBlankDataTag}]`);
        blanks.forEach(blank => {
            const textNode = document.createTextNode(FormsComposerConst.fillBlankUnderline);
            blank.replaceWith(textNode);
        });

        // 5. Sanitize and return the HTML
        return DOMPurify.sanitize(doc.body.innerHTML);
    }


    static question(question: string): string {
        return this.renderBlock(question);
    }

    static explanation(explanation: string): string {
        return this.renderBlock(explanation);
    }

    static hint(hint: string): string {
        return this.renderBlock(hint);
    }

    static inlineTextAnswer(answer: string): string {
        return this.renderBlock(answer);
    }

    static blockTextAnswer(answer: string): string {
        return this.renderBlock(answer);
    }

    static choiceText(choice: string): string {
        return this.renderInline(choice);
    }

    static pairMatchText(text: string): string {
        return this.renderInline(text);
    }

    static fillBlanksText(text: string): string {
        return this.renderInline(text);
    }

}