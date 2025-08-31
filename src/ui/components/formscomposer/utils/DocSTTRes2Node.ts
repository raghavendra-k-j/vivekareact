import { Fragment, Node as ProseMirrorNode } from 'prosemirror-model';
import { DocSTTRes, Paragraph, TextRun, TextRunType } from '~/domain/forms/stt/FormsSTTRes';
import { FormsComposerSchema, inlineSchema } from '../core/schema';

type RunConverter = (run: TextRun, schema: FormsComposerSchema) => ProseMirrorNode;

export class DocSTTRes2Node {

    private static runHandlers: Record<TextRunType, RunConverter> = {
        [TextRunType.TEXT]: (run, schema) => schema.text(run.content),
        [TextRunType.LATEX]: (run, schema) => schema.nodes.latex.create({ latex: run.content }),
    };

    private static convertRun(run: TextRun, schema: FormsComposerSchema): ProseMirrorNode {
        const handler = this.runHandlers[run.type];
        if (!handler) throw new Error(`Unsupported run type: ${run.type}`);
        return handler(run, schema);
    }

    private static convertParagraphRuns(runs: TextRun[], schema: FormsComposerSchema): ProseMirrorNode[] {
        const nodes: ProseMirrorNode[] = [];

        runs.forEach((run, index) => {
            nodes.push(this.convertRun(run, schema));

            const isNotLast = index < runs.length - 1;
            if (isNotLast) {
                nodes.push(schema.text(' '));
            }
        });

        return nodes;
    }

    private static convertToSingleParagraph(paragraphs: Paragraph[]): Paragraph {
        const combinedRuns: TextRun[] = [];
        paragraphs.forEach(paragraph => {
            paragraph.runs.forEach(run => {
                combinedRuns.push(run);
            });
        });
        return new Paragraph({ runs: combinedRuns });
    }


    static convert(content: DocSTTRes, schema: FormsComposerSchema): Fragment {
        const { paragraphs } = content;

        if (paragraphs.length === 1) {
            const [paragraph] = paragraphs;
            const inlineNodes = this.convertParagraphRuns(paragraph.runs, schema);
            return Fragment.fromArray(inlineNodes);
        }

        if (paragraphs.length > 1 && schema === inlineSchema) {
            // If there are multiple paragraphs and the schema is inline, convert to a single paragraph
            const paragraph = this.convertToSingleParagraph(paragraphs);
            const inlineNodes = this.convertParagraphRuns(paragraph.runs, schema);
            return Fragment.fromArray(inlineNodes);
        }

        const blockNodes = paragraphs.map(paragraph => {
            const runNodes = this.convertParagraphRuns(paragraph.runs, schema);
            return schema.nodes.paragraph.create(null, Fragment.fromArray(runNodes));
        });

        return Fragment.fromArray(blockNodes);
    }
}
