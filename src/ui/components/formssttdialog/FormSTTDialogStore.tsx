import { makeObservable, observable, reaction, runInAction } from "mobx";
import { logger } from "~/core/utils/logger";
import { FormsSTTRes } from "~/domain/forms/stt/FormsSTTRes";
import { FormsSTTService } from "~/domain/forms/stt/FormsSTTService";
import { OS } from "~/infra/utils/deviceinfo/BrowserInfo";
import { BrowserInfoUtil } from "~/infra/utils/deviceinfo/BrowserInfoUtil";
import { STT, STTError, STTErrorCode } from "~/infra/utils/stt";
import { STTDataState } from "~/ui/utils/STTDataState";
import { DocSTTResVm } from "./models/DocSTTResVm";
import { FormsSTTDocOptions, FormsSTTLaTexOptions, FormsSTTOptions } from "./models/FormatSTTOptions";
import { LaTexSTTResVm } from "./models/LaTexSTTResVm";
import { STTResVmFactory } from "./models/STTResVmFactory";
import { STTResVm } from "./models/STTResVm";
import { STTFormatStore } from "./STTFormatStore";
import { STTRecorderStore } from "./STTRecorderStore";
import { showErrorToast } from "~/ui/widgets/toast/toast";


export type FormsSTTDialogStoreProps = {
    options: FormsSTTOptions;
    onClose: () => void;
    onDone: (res: FormsSTTRes) => void;
}

export class FormsSTTDialogStore {


    options: FormsSTTOptions;
    _stt: STT | null = null;
    recorderStore: STTRecorderStore;
    formatStore: STTFormatStore;
    sttService: FormsSTTService;
    continious: boolean = true;
    intermResults: boolean = true;
    onClose: () => void;
    onDone: (res: FormsSTTRes) => void;

    // Reference to avoid type conversion
    _docOptions: FormsSTTDocOptions | null = null;
    _latexOptions: FormsSTTLaTexOptions | null = null;

    // State Variables
    resVm: STTResVm;
    isAttemptingDone: boolean = false;


    constructor(props: FormsSTTDialogStoreProps) {
        this.options = props.options;
        if (this.isDoc) {
            this._docOptions = this.options as FormsSTTDocOptions;
        }
        if (this.isLaTex) {
            this._latexOptions = this.options as FormsSTTLaTexOptions;
        }
        this.recorderStore = new STTRecorderStore({
            storeRef: this,
            onNewTranscription: this.onReceiveTranscription.bind(this),
        });
        this.formatStore = new STTFormatStore({ storeRef: this });
        this.sttService = new FormsSTTService();
        this.computeContinuous();
        this.resVm = STTResVmFactory.empty(this);
        this.onClose = props.onClose;
        this.onDone = props.onDone;
        this.setUpSTTReactions();
        makeObservable(this, {
            _stt: observable.ref,
            resVm: observable.ref,
        });
    }


    private setUpSTTReactions() {
        // Cancels the active recognition when the language changes
        reaction(
            () => this.options.languageField.value,
            () => {
                this.cancelActiveRecognition();
            }
        );
    }

    /* 
    Cancels the current Speech Recognition if any is active.
    Resets everything to prepare for a new recording. 
    */
    private cancelActiveRecognition() {
        this._stt?.abort();
        this.resetForNewRecording();
    }

    /* 
    Checks whether continuous STT is supported based on the device OS.
    */
    private computeContinuous() {
        const deviceInfo = BrowserInfoUtil.getDeviceInfo();
        logger.debug("Device Info for STT continuous check:", deviceInfo);
        if (deviceInfo.os === OS.Android) {
            this.continious = false;
            this.intermResults = true;
        } else {
            this.continious = true;
            this.intermResults = true;
        }
    }


    set stt(stt: STT | null) {
        if (stt) {
            this.setUpSTT(stt);
        }
        else {
            this.releaseSTT();
        }
    }

    private setUpSTT(stt: STT) {
        this.cancelActiveRecognition();
        this._stt = stt;
        this.recorderStore.addSTTListeners();
    }

    private releaseSTT() {
        this.cancelActiveRecognition();
        this.recorderStore.removeListeners();
        this._stt = null;
    }

    get hasSTT(): boolean {
        return this._stt !== null;
    }

    get stt(): STT {
        if (!this._stt) {
            throw new Error("STT is not initialized");
        }
        return this._stt!;
    }


    /* 
    Starts the Speech Recognition
    */
    startListening() {
        if (!this.hasSTT) {
            logger.error("STT is not initialized");
            const error = new STTError(STTErrorCode.INSTANCE_NOT_INITIALIZED, "STT is not initialized");
            const errorDetails = this.recorderStore.convertToAppError(error);
            showErrorToast({
                message: errorDetails.message,
                description: errorDetails.description,
            });
            return;
        }
        if (this.isSomethingInProgress) {
            logger.warn("STT or formatting is already in progress");
            return;
        }
        logger.debug("Starting STT with options", this.options.language.ttsCode);
        this.stt.start({
            lang: this.options.language.ttsCode,
            continuous: this.continious,
            interimResults: this.intermResults,
        });
    }

    get sttState() {
        return this.recorderStore.sttState;
    }

    get formatState() {
        return this.formatStore.formState;
    }

    /* 
    Checks whether any STT or formatting is in progress.
    */
    public get isSomethingInProgress() {
        if (this.sttState.isActive) {
            return true;
        }
        if (this.formatState.isLoading) {
            return true;
        }
        return false;
    }

    /* 
    Handles the received transcription from the STT engine.
    */
    public onReceiveTranscription(transcription: string): void {
        this.formatStore.startProcessing(transcription);
    }

    public get isLaTex() {
        return this.options.isLaTeX;
    }

    public get isDoc() {
        return this.options.isDoc;
    }

    public get docResVm(): DocSTTResVm {
        return this.resVm as unknown as DocSTTResVm;
    }

    public get latexResVm(): LaTexSTTResVm {
        return this.resVm as unknown as LaTexSTTResVm;
    }

    get shouldShowToggleEnableAi(): boolean {
        return this.isDoc && this.docOptions.aiAllowed;
    }

    get shouldShowLanguageSelector(): boolean {
        return this.options.languages.length > 1;
    }

    get shouldShowSettings(): boolean {
        if (this.shouldShowToggleEnableAi) {
            return true;
        }
        if (this.shouldShowLanguageSelector) {
            return true; // Show settings if more than one language is available
        }
        return false;
    }


    public get docOptions(): FormsSTTDocOptions {
        if (!this.isDoc) {
            throw new Error("This is not a FormsSTTDocOptions instance");
        }
        return this._docOptions!;
    }

    public get latexOptions(): FormsSTTLaTexOptions {
        if (!this.isLaTex) {
            throw new Error("This is not a FormsSTTLaTexOptions instance");
        }
        return this._latexOptions!;
    }


    returnCurrentResult() {
        logger.debug("returnCurrentResult");
        if (this.isSomethingInProgress) {
            logger.warn("Cannot return result while STT or formatting is in progress");
            return;
        }
        // If the result is empty, close the dialog without returning anything
        if (this.resVm.isContentEmpty()) {
            this.onClose();
            return;
        }
        this.onDone(STTResVmFactory.toFormsSTTRes(this.resVm));
    }

    resetForNewRecording() {
        this.recorderStore.resetState();
        this.formatStore.resetState();
        this.isAttemptingDone = false; // Reset the flag
    }


    handleOnClickMicButton() {
        if (this.formatState.isLoading) {
            return; // Wait for the current formatting to finish
        }
        if (this.recorderStore.sttState.isListening) {
            this.stopSTT();
        }
        else if (!this.recorderStore.sttState.isWaiting) {
            this.isAttemptingDone = false; // Reset the flag: Since explicitly starting the STT
            this.startListening();
        }
        // Ignore rest of the cases
    }


    /* 
    Checks whether the Done button is enabled based on the current state.
    */
    public get isDoneButtonEnabled() {
        if (this.sttState.isListening) return true; // If STT is listening, allow Done
        if (this.formatState.isLoading) return false; // If formatting is in progress, disable Done
        if (this.resVm.isContentEmpty()) return false; // If no content, disable Done
        return true; // Otherwise, enable Done
    }


    // Done for whole dialog
    handleOnClickDone(): void {
        if (this.sttState.isListening) {
            // STT is still active, Stop it
            // Update the state to waiting to end
            this.stopSTT();
            this.isAttemptingDone = true;
            return;
        }

        // return the current result if available
        this.returnCurrentResult();
    }

    // Cancel for whole dialog
    handleOnClickCancel(): void {
        this.stt?.abort();
        this.onClose();
    }

    // Handle the Done Icon button click for current session
    handleOnClickDoneRecording(): void {
        if (this.formatState.isLoading) {
            return; // Avoid multiple clicks
        }
        if (this.recorderStore.sttState.isListening) {
            this.stopSTT();
        }
    }


    handleOnClickCancelRecording(): void {
        logger.debug("handleOnClickCancelRecording");
        this.recorderStore.isAborted = true; // Set the aborted flag
        this.stt?.abort();
    }

    private stopSTT() {
        runInAction(() => {
            this.recorderStore.sttState = STTDataState.waitingToEnd();
        });
        this._stt?.stop();
    }


}