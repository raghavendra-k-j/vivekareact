import { QExtras } from "~/domain/forms/models/question/QExtras";
import { Answer } from "~/domain/forms/models/answer/Answer";
import { UpsertQuestionStore } from "../UpsertQuestionStore";

export type EnAVmProps = {
    storeRef: UpsertQuestionStore;
}

export type EnAVmData = {
    qExtra: QExtras | null;
    answer: Answer | null;
}



export abstract class EnAVm {
    readonly storeRef: UpsertQuestionStore;
    constructor(props: EnAVmProps) {
        this.storeRef = props.storeRef;
    }
    abstract getQExtra(): QExtras | null;
    abstract getAnswer(): Answer | null;
    abstract render(): React.ReactNode;
}
