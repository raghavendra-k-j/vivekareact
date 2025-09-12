export class SpeakQuestionUtil {

    private static fillBlankCounter = 0;

    static readHtml(html: string): string {
        this.fillBlankCounter = 0;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        if (!doc.body) return "";
        return this.extractTextFromElement(doc.body).trim();
    }

    private static extractTextFromElement(element: Element): string {
        let text = "";

        for (const child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent || "";
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as Element;

                if (el.hasAttribute("data-tag-fill-blank")) {
                    text += this.renderFillBlankText();
                } else if (
                    el.hasAttribute("data-tag-blatext") ||
                    el.hasAttribute("data-tag-ilatex")
                ) {
                    text += this.renderLatexElementText(el);
                } else {
                    text += this.extractTextFromElement(el);
                }
            }
        }

        return text;
    }

    private static renderFillBlankText(): string {
        this.fillBlankCounter++;
        return `, Fill up ${this.fillBlankCounter}, `;
    }

    private static renderLatexElementText(el: Element): string {
        const text = el.getAttribute("data-tag-blatext") || el.getAttribute("data-tag-ilatex") || "";
        const trimmed = text.trim();
        return trimmed ? ` ${trimmed} ` : " ";
    }

    public static readChoices(htmlChoices: string[]): string[] {
        return htmlChoices.map((choice, index) => {
            const label = String.fromCharCode(65 + index);
            const content = this.readHtml(choice);
            return `Option ${label}: ${content}.`;
        });
    }

    public static readQuestion(question: string): string {
        return this.readHtml(question);
    }



}
