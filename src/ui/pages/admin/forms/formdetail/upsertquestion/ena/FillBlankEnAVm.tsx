import { Node as ProseMirrorNode } from "prosemirror-model";
import { EnAVm, EnAVmProps } from "./EnAVmBase";
import { Answer, FillBlankInputAnswer, FillBlanksAnswer } from "~/domain/forms/models/answer/Answer";
import { FillBlankInput, FillBlanksQExtras, QExtras } from "~/domain/forms/models/question/QExtras";
import { UpsertQuestionStore } from "../UpsertQuestionStore";
import { makeObservable, observable, reaction } from "mobx";
import { Question } from "~/domain/forms/admin/models/Question";
import { FillBlankEnAVmItem } from "./FillBlankEnAVmItem";
import { FillBlankEnAVmView } from "./FillBlankEnAVmView";
import { PmToHtml } from "~/ui/components/formscomposer/utils/PmToHtml";
import { inlineSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";


export type FillBlankEnAVmProps = EnAVmProps & {

}

export class FillBlankEnAVm extends EnAVm {
    items: FillBlankEnAVmItem[];

    constructor(props: FillBlankEnAVmProps) {
        super(props);
        this.items = [];
        this.addListenerForQuestionChange();
        makeObservable(this, {
            items: observable.shallow,
        });
    }

    addListenerForQuestionChange() {
        reaction(
            () => this.storeRef.qvmState.data?.questionNode,
            (node) => {
                this.syncBlanks(node || null);
            }
        );
    }

    syncBlanks(node: ProseMirrorNode | null) {
        if (!node) {
            this.clearItems();
        }
        else {
            const totalBlanks = this.countBlanks(node);
            if (totalBlanks === this.items.length) {
                return;
            }
            if (totalBlanks < this.items.length) {
                this.items.splice(totalBlanks);
            }
            else {
                const newItemsCount = totalBlanks - this.items.length;
                for (let i = 0; i < newItemsCount; i++) {
                    const newItem = new FillBlankEnAVmItem({
                        node: null,
                    });
                    this.items.push(newItem);
                }
            }
        }
    }


    countBlanks(node: ProseMirrorNode) {
        let count = 0;
        node.descendants((e) => {
            if (e.type.name === "fillBlank") {
                count++;
            }
            return true;
        });
        return count;
    }


    clearItems() {
        this.items = [];
    }


    getQExtra(): QExtras | null {
        if (this.items.length === 0) {
            return null;
        }
        const inputs: FillBlankInput[] = [];
        for (let i = 1; i <= this.items.length; i++) {
            const inputItem = new FillBlankInput({ id: i });
            inputs.push(inputItem);
        }
        return new FillBlanksQExtras({ inputs: inputs, });
    }

    getAnswer(): Answer | null {
        if (this.items.length === 0) {
            return null;
        }
        const ansInputs: FillBlankInputAnswer[] = [];
        for (let i = 1; i <= this.items.length; i++) {
            const item = this.items[i - 1];
            let ansString = "";
            if (item.node) {
                ansString = PmToHtml.convert(item.node, inlineSchema);
            }
            ansInputs.push(new FillBlankInputAnswer({ id: i, answer: ansString }));
        }
        return new FillBlanksAnswer({ answers: ansInputs });
    }


    static empty({ storeRef }: { storeRef: UpsertQuestionStore }): FillBlankEnAVm {
        return new FillBlankEnAVm({
            storeRef: storeRef,
        });
    }

    static fromQuestion(props: { question: Question; storeRef: UpsertQuestionStore; }): EnAVm | null {
        const qExtras = props.question.qExtras as FillBlanksQExtras;
        const answer = props.question.answer as FillBlanksAnswer;

        const vm = new FillBlankEnAVm({
            storeRef: props.storeRef,
        });

        const inputs: FillBlankEnAVmItem[] = [];
        const answerToIdMap = answer.toIdMap();

        for (const input of qExtras.inputs) {
            const node = FormsComposerUtil.toNode({
                text: answerToIdMap[input.id]!,
                schema: inlineSchema,
            });
            const item = new FillBlankEnAVmItem({
                node: node,
            });
            inputs.push(item);
        }
        vm.items = inputs;
        return vm;
    }


    render(): React.ReactNode {
        return FillBlankEnAVmView(this);
    }

}



