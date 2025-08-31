import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { logger } from "~/core/utils/logger";
import { AiEquationReq } from "~/domain/forms/stt/AiEquationModels";
import { AiFormatReq } from "~/domain/forms/stt/AiFormatSTTModels";
import { Paragraph } from "~/domain/forms/stt/FormsSTTRes";
import { DataState } from "~/ui/utils/DataState";
import { FormsSTTDialogStore } from "./FormSTTDialogStore";

export type STTFormatStoreProps = {
    storeRef: FormsSTTDialogStore;
}

export class STTFormatStore {

    storeRef: FormsSTTDialogStore;

    // State Variables
    queuedTranscription: string = "";
    formState: DataState<void> = DataState.init<void>();

    constructor(props: STTFormatStoreProps) {
        this.storeRef = props.storeRef;
        makeObservable(this, {
            formState: observable.ref,
        });
    }

    /* 
    Resets everything related to formatting state.
    */
    resetState() {
        this.queuedTranscription = "";
        runInAction(() => {
            this.formState = DataState.init<void>();
        });
    }


    /* 
    Processes the transcription without AI formatting.
    */
    async formatWithoutAi(text: string) {
        runInAction(() => {
            this.formState = DataState.loading();
        });
        const paragraph = Paragraph.text(text);
        runInAction(() => {
            this.storeRef.docResVm.add(paragraph);
        });
        const isAttemptingDone = this.storeRef.isAttemptingDone; // Store it before resetting
        this.storeRef.resetForNewRecording();
        if (isAttemptingDone) {
            this.storeRef.returnCurrentResult();
        }
    }

    async startProcessing(text: string) {
        this.queuedTranscription = text;
        let aiEnabled = false;
        if (this.storeRef.isLaTex) {
            aiEnabled = true; // LaTeX formatting always uses AI
        }
        else {
            aiEnabled = this.storeRef.docOptions.aiEnabled;
        }

        if (aiEnabled) {
            await this.formatUsingAi(text);
        }
        else {
            await this.formatWithoutAi(text);
        }
    }

    async formatUsingAi(text: string) {
        try {
            runInAction(() => {
                this.formState = DataState.loading();
            });
            await this.sendRequestAndUpdateVm(text);
            runInAction(() => {
                this.formState = DataState.data(undefined);
            });
            this.finalizeTranscription();
        }
        catch (error) {
            logger.error("startAiTranscription", error);
            if (this.storeRef.isAttemptingDone) {
                // Since this is an error during the finalization of the transcription,
                // but it is an error, reset the flag, so on retry success, it will not autoclose the dialog.
                this.storeRef.isAttemptingDone = false;
            }
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.formState = DataState.error(appError);
            });
        }
    }

    private async sendRequestAndUpdateVm(text: string) {
        if (this.storeRef.isDoc) {
            let finalText = this.getPrevDocContext();
            if (finalText) {
                finalText += "\n\n";
            }
            finalText += text;
            const docReq = new AiFormatReq({
                formId: this.storeRef.docOptions.formId,
                isRespondent: this.storeRef.docOptions.isRespondent,
                language: this.storeRef.docOptions.language.ttsCode,
                text: finalText,
            });
            const docRes = (await this.storeRef.sttService.format(docReq)).getOrError();
            runInAction(() => {
                this.storeRef.docResVm.replace(docRes);
            });
        }
        else {
            const latexReq = new AiEquationReq({
                formId: this.storeRef.latexOptions.formId,
                isRespondent: this.storeRef.latexOptions.isRespondent,
                language: this.storeRef.latexOptions.language.ttsCode,
                text: text,
            });
            const latexRes = (await this.storeRef.sttService.generateEquation(latexReq)).getOrError();
            runInAction(() => {
                this.storeRef.latexResVm.replace(latexRes.latex);
            });
        }
    }

    getPrevDocContext(): string {
        if (this.storeRef.isLaTex) return "";
        return this.storeRef.docResVm.toMarkdown();
    }

    handleRetryFormatting(): void {
        if (!this.queuedTranscription) {
            logger.warn("No transcription to retry");
            this.handleIgnoreTranscriptionError();
            return;
        }
        this.startProcessing(this.queuedTranscription);
    }

    handleIgnoreTranscriptionError(): void {
        this.storeRef.resetForNewRecording();
    }

    private finalizeTranscription() {
        this.storeRef.resetForNewRecording();
        if (this.storeRef.isAttemptingDone) {
            this.storeRef.returnCurrentResult();
        }
    }

}