import { action, makeObservable, observable } from "mobx"
import { Paragraph, TextRunType } from "~/domain/forms/stt/FormsSTTRes"
import { STTResVm } from "./STTResVm";
import { AiFormatRes } from "~/domain/forms/stt/AiFormatSTTModels";

export type DocSTTResVmProps = {
    isMultiline: boolean;
}

export class DocSTTResVm extends STTResVm {

    paragraphs: Paragraph[] = []
    isMultiline: boolean;

    constructor(props: DocSTTResVmProps) {
        super();
        this.isMultiline = props.isMultiline;
        makeObservable(this, {
            paragraphs: observable.shallow,
            add: action,
            removeById: action,
            clear: action,
            replace: action,
        });
    }

    clear() {
        this.paragraphs = [];
    }

    get isEmpty(): boolean {
        return this.paragraphs.length === 0 || this.paragraphs.every(p => p.isEmpty);
    }

    add(paragraph: Paragraph) {
        if (this.isMultiline) {
            this.paragraphs.push(paragraph);
        }
        else {
            if (this.isEmpty) {
                this.paragraphs.push(paragraph);
            }
            else {
                this.paragraphs[0].merge(paragraph);
                this.paragraphs[0] = this.paragraphs[0].shallowCopy();
            }
        }
    }

    removeById(uuid: string) {
        const index = this.paragraphs.findIndex(p => p.uuid === uuid);
        if (index !== -1) {
            this.paragraphs.splice(index, 1);
        }
    }

    toMarkdown(): string {
        let strList: string[] = [];
        for (const paragraph of this.paragraphs) {
            const runList: string[] = [];
            for (const run of paragraph.runs) {
                if (run.isEmpty) {
                    continue;
                }
                if (run.type === TextRunType.LATEX) {
                    runList.push(`$${run.content}$`);
                } else {
                    runList.push(run.content);
                }
            }
            if (runList.length === 0) {
                continue;
            }
            strList.push(runList.join(""));
        }
        return strList.join("\n\n");
    }

    replace(res: AiFormatRes) {
        this.clear();
        for (const p of res.paragraphs) {
            const paragraph = Paragraph.fromAiFormatParagraph(p);
            this.add(paragraph);
        }
    }

    isContentEmpty(): boolean {
        return this.isEmpty;
    }

}