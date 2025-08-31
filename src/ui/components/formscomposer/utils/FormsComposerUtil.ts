import { Node as ProseMirrorNode } from 'prosemirror-model';
import { PmToHtml } from './PmToHtml';
import { HtmlToPm } from './HtmlToPm';
import { FormsComposerSchema } from '../core/schema';
import { FormsComposerEditorRef } from '../FormsComposerEditor';

interface ToNodeParams {
    text: string | null;
    schema: FormsComposerSchema;
}

interface ToTextParams {
    doc: ProseMirrorNode | null;
    schema: FormsComposerSchema;
}

interface ToTextFromRefParams {
    ref: React.RefObject<FormsComposerEditorRef | null>;
    schema: FormsComposerSchema;
}

export class FormsComposerUtil {

    /**
     * Converts an HTML string to a ProseMirror node.
     * Returns null if input text is empty or invalid.
     */
    static toNode({ text, schema }: ToNodeParams): ProseMirrorNode | null {
        const trimmed = text?.trim();
        if (!trimmed) return null;
        try {
            return HtmlToPm.parse(trimmed, schema);
        } catch (error) {
            console.warn('Failed to parse HTML to ProseMirror node:', error);
            return null;
        }
    }

    /**
     * Converts an HTML string to a ProseMirror node.
     * Returns an empty node if input text is empty or invalid.
     */
    static toNodeOrEmpty({ text, schema }: ToNodeParams): ProseMirrorNode {
        const node = this.toNode({ text, schema });
        return node ?? schema.nodes.paragraph.createAndFill()!;
    }

    /**
     * Converts a ProseMirror node to an HTML string.
     * Returns null if result is empty or input doc is null.
     */
    static toText({ doc, schema }: ToTextParams): string | null {
        if (!doc) return null;
        try {
            const html = PmToHtml.convert(doc, schema).trim();
            return html === '' ? null : html;
        } catch (error) {
            console.warn('Failed to convert ProseMirror node to HTML:', error);
            return null;
        }
    }

    /**
     * Converts a ProseMirror node to an HTML string.
     * Returns empty string if result is empty or input doc is null.
     */
    static toTextOrEmpty({ doc, schema }: ToTextParams): string {
        return this.toText({ doc, schema }) ?? '';
    }

    /**
     * Gets content from an editor ref and converts it to an HTML string.
     * Returns null if editor or content is missing.
     */
    static toTextFromRef({ ref, schema }: ToTextFromRefParams): string | null {
        const editor = ref.current;
        if (!editor) return null;
        const content = editor.getContent();
        if (!content) return null;
        return this.toText({ doc: content, schema });
    }

    /**
     * Gets content from an editor ref and converts it to an HTML string.
     * Returns empty string if editor or content is missing.
     */
    static toTextFromRefOrEmpty({ ref, schema }: ToTextFromRefParams): string {
        return this.toTextFromRef({ ref, schema }) ?? '';
    }

    static isEmpty(val: ProseMirrorNode | null, _blockSchema: FormsComposerSchema): boolean {
        if (!val) return true;
        const textContent = val.textContent.trim();
        if (textContent === '') return true;
        else return false;
    }

}
