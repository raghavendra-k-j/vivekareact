import { FormsSTTRes, FormsSTTResType, LatexSTTRes, DocSTTRes, Paragraph, TextRun, TextRunType } from "./FormsSTTRes";

export class FormsSTTResParser {

    /**
     * Public method to parse the model's response.
     * @param response The model's response as a string.
     * @returns The parsed content as a `Content` object.
     */
    public static parse({ rawContent, contentType }: { rawContent: string; contentType: FormsSTTResType; }): FormsSTTRes {
        const cleanedMarkdown = this.cleanMarkdown(rawContent);
        const content = this.parseContentFromMarkdown(cleanedMarkdown, contentType);
        return content;
    }

    /**
     * Cleans the raw response to extract the markdown content.
     * @param raw The raw response string from the model.
     * @returns A cleaned markdown string.
     */
    private static cleanMarkdown(raw: string): string {
        if (!raw) return "";

        const trimmed = raw.trim();

        // Match the first fenced ```markdown block
        const markdownFenceRegex = /```(?:markdown)?\s*([\s\S]*?)\s*```/i;
        const match = trimmed.match(markdownFenceRegex);

        // If a fenced code block exists, extract the content within the fence
        if (match && match[1]) {
            return match[1].trim();
        }

        // If there is no fence, treat the entire string as raw markdown
        return trimmed;
    }

    /**
     * Parses the cleaned markdown into `Content`.
     * @param markdown The cleaned markdown string.
     * @returns The parsed content as a `Content` object.
     */
    private static parseContentFromMarkdown(markdown: string, contentType: FormsSTTResType): FormsSTTRes {
        // Split the markdown into paragraphs
        const rawParagraphs = this.splitMarkdownIntoParagraphs(markdown);

        // Convert each paragraph to a `Paragraph` object
        const paragraphs = rawParagraphs.map(this.parseParagraph.bind(this));

        if (contentType === FormsSTTResType.LATEX) {
            // find the first latex run
            const latexRuns: TextRun[] = paragraphs.flatMap(p => p.runs.filter(r => r.type === TextRunType.LATEX));
            const latexString = latexRuns.length > 0 ? latexRuns[0].content : "";
            return new LatexSTTRes(latexString);
        }

        // Return the content model containing the paragraphs
        return new DocSTTRes(paragraphs);
    }

    /**
     * Splits the markdown content into paragraphs based on double line breaks.
     * @param markdown The markdown string to be split.
     * @returns An array of paragraph strings.
     */
    private static splitMarkdownIntoParagraphs(markdown: string): string[] {
        // Split the markdown into paragraphs by detecting two or more line breaks
        return markdown.trim().split(/\n{2,}/);
    }

    /**
     * Parses a single paragraph of markdown text into a `Paragraph` object.
     * @param paragraphText The paragraph text to be parsed.
     * @returns A `Paragraph` object containing the parsed text and LaTeX.
     */
    private static parseParagraph(paragraphText: string): Paragraph {
        const paragraph = new Paragraph();

        // Match inline ($...$), block (\[...\]), and block (\(...\)) LaTeX
        const parts = paragraphText.split(/(\\\[.*?\\\]|\\\(.*?\\\)|\$[^$]+\$)/g);

        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;

            if (
                (trimmed.startsWith('$') && trimmed.endsWith('$')) ||
                (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) ||
                (trimmed.startsWith('\\(') && trimmed.endsWith('\\)'))
            ) {
                // Remove LaTeX delimiters
                const latexContent = trimmed
                    .replace(/^\$|^\s*\\\[|^\s*\\\(/, '')
                    .replace(/\$$|\s*\\\]$|\s*\\\)$/, '')
                    .trim();

                paragraph.addRun(new TextRun({
                    type: TextRunType.LATEX,
                    content: latexContent
                }));
            } else {
                // Plain text
                paragraph.addRun(new TextRun({
                    type: TextRunType.TEXT,
                    content: trimmed
                }));
            }
        }

        return paragraph;
    }

}
