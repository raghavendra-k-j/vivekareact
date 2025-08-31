import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { logger } from "~/core/utils/logger";
import { StrUtils } from "~/core/utils/StrUtils";
import { STT, STTError, STTErrorCode } from "~/infra/utils/stt";
import { STTDataState } from "~/ui/utils/STTDataState";
import { FormsSTTDialogStore } from "./FormSTTDialogStore";
import { DataState } from "~/ui/utils/DataState";

export type STTRecorderStoreProps = {
    storeRef: FormsSTTDialogStore;
    onNewTranscription: (transcription: string) => void;
}

export class STTRecorderStore {

    storeRef: FormsSTTDialogStore;
    onNewTranscription: (transcription: string) => void;

    // State Variables    
    sttState = STTDataState.init();
    liveTranscription: string = "";
    transcriptionBuffer: string = "";
    isAborted: boolean = false;

    constructor(props: STTRecorderStoreProps) {
        this.storeRef = props.storeRef;
        this.onNewTranscription = props.onNewTranscription;
        makeObservable(this, {
            sttState: observable.ref,
            liveTranscription: observable,
            transcriptionBuffer: observable,
        });
    }

    get stt(): STT {
        return this.storeRef.stt;
    }

    get optStt(): STT | null {
        return this.storeRef._stt;
    }


    private onSTTStart = () => {
        runInAction(() => {
            this.transcriptionBuffer = this.liveTranscription = "";
            this.sttState = STTDataState.listening();
            this.storeRef.formatStore.formState = DataState.init();
        });
    }

    private onEnd = () => {
        logger.debug("STT onEnd");
        // If it was aborted, we don't process the end
        if(this.isAborted) {
            logger.debug("STT was aborted, not processing end");
            this.storeRef.resetForNewRecording();
            return; // If it was aborted, we don't process the end
        }

        runInAction(() => {
            const trimmed = StrUtils.trimToNull(this.transcriptionBuffer);
            if (!trimmed) {
                // If no transcription was captured, reset the state
                this.storeRef.resetForNewRecording();
                return;
            }
            this.resetState();
            this.onNewTranscription(trimmed);
        });
    }

    private onSTTError = (error: STTError, event?: SpeechRecognitionErrorEvent) => {
        if (error.code === STTErrorCode.ABORTED) {
            return; // Ignore abort errors
        }
        logger.error("onSTTError:", error.code, error.message, event?.error);
        let appError = this.convertToAppError(error);
        runInAction(() => {
            this.sttState = STTDataState.error(appError);
        });
    }

    onResult = (result: string) => {
        runInAction(() => {
            this.liveTranscription = this.transcriptionBuffer = result;
        });
    };


    onPartialResult = (result: string) => {
        runInAction(() => {
            if (this.transcriptionBuffer.length > 0) {
                this.liveTranscription = this.transcriptionBuffer + " " + result;
            } else {
                this.liveTranscription = result;
            }
        });
    };

    public addSTTListeners() {
        this.optStt?.onStart(this.onSTTStart);
        this.optStt?.onEnd(this.onEnd);
        this.optStt?.onError(this.onSTTError);
        this.optStt?.onResult(this.onResult);
        this.optStt?.onPartialResult(this.onPartialResult);
    }

    public removeListeners() {
        this.optStt?.offStart(this.onSTTStart);
        this.optStt?.offEnd(this.onEnd);
        this.optStt?.offError(this.onSTTError);
        this.optStt?.offResult(this.onResult);
        this.optStt?.offPartialResult(this.onPartialResult);
    }


    /* 
    Resets everything related to STT state.
    */
    resetState() {
        this.isAborted = false;
        runInAction(() => {
            this.transcriptionBuffer = "";
            this.liveTranscription = "";
            this.sttState = STTDataState.init();
        });
    }


    /* 
    Returns user friendly error messages based on the STTError code.
    */
    public convertToAppError(error: STTError): AppError {
        switch (error.code) {
            case STTErrorCode.ALREADY_STARTED: {
                const appError = new AppError({
                    message: "Speech recognition is already running",
                    description: "You're already using speech recognition. Please stop the current session before starting a new one."
                });
                return appError;
            }
            case STTErrorCode.INSTANCE_NOT_INITIALIZED: {
                return new AppError({
                    message: "Speech recognition isn’t ready yet",
                    description: "The service didn’t start properly. Try refreshing the page and then try again."
                });
            }
            case STTErrorCode.SPEECH_NOT_SUPPORTED: {
                return new AppError({
                    message: "Speech recognition isn’t supported",
                    description: "It looks like your browser doesn’t support speech recognition. Try using the latest version of Chrome or Edge."
                });
            }
            case STTErrorCode.MIC_PERMISSION_DENIED: {
                return new AppError({
                    message: "Microphone permission needed",
                    description: "We can’t access your microphone. Please check your browser settings to enable mic access, then reload the page."
                });
            }
            case STTErrorCode.NO_SPEECH_DETECTED: {
                return new AppError({
                    message: "We didn’t hear anything",
                    description: "No speech was detected. Try again, and make sure you're speaking clearly into the microphone."
                });
            }
            default: {
                return new AppError({
                    message: "Something went wrong",
                    description: "An unexpected error occurred during speech recognition. Please try again or refresh the page."
                });
            }
        }
    }


}