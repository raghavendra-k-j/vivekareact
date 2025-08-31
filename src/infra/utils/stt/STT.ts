import { logger } from '~/core/utils/logger.ts';
import { STTError, STTErrorCode, STTEventType, STTStartOptions } from './models.ts';

export class STT {

    private recognition?: SpeechRecognition;

    private recognizing = false;

    get recognitionInstance(): SpeechRecognition {
        return this.recognition!;
    }

    private finalTranscript = "";

    private readonly startListeners = new Set<() => void>();

    private readonly endListeners = new Set<() => void>();

    private readonly resultListeners = new Set<(text: string) => void>();

    private readonly partialResultListeners = new Set<(text: string) => void>();

    private readonly errorListeners = new Set<(err: STTError, errorEvent?: SpeechRecognitionErrorEvent) => void>();

    public instanceId: string;

    constructor({ instanceId = "default" }: { instanceId?: string } = {}) {
        this.instanceId = instanceId;

        if (typeof window === "undefined") return;

        const Impl = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!Impl) return;

        this.recognition = new Impl();
        logger.debug("STT instance created with ID:", this.instanceId);
        this.bindEvents();
    }

    public onStart(handler: () => void) {
        logger.debug("Adding start listener for STT instance ID:", this.instanceId);
        this.finalTranscript = "";
        this.startListeners.add(handler);
    }

    public onEnd(handler: () => void) {
        logger.debug("Adding end listener for STT instance ID:", this.instanceId);
        this.endListeners.add(handler);
    }

    public onResult(handler: (text: string) => void) {
        logger.debug("Adding result listener for STT instance ID:", this.instanceId);
        this.resultListeners.add(handler);
    }

    public onPartialResult(handler: (text: string) => void) {
        logger.debug("Adding partial result listener for STT instance ID:", this.instanceId);
        this.partialResultListeners.add(handler);
    }

    public onError(handler: (error: STTError, errorEvent?: SpeechRecognitionErrorEvent) => void) {
        logger.debug("Adding error listener for STT instance ID:", this.instanceId);
        this.errorListeners.add(handler);
    }

    public offStart(handler: () => void) {
        logger.debug("Removing start listener for STT instance ID:", this.instanceId);
        this.startListeners.delete(handler);
    }

    public offEnd(handler: () => void) {
        logger.debug("Removing end listener for STT instance ID:", this.instanceId);
        this.endListeners.delete(handler);
    }

    public offResult(handler: (text: string) => void) {
        logger.debug("Removing result listener for STT instance ID:", this.instanceId);
        this.resultListeners.delete(handler);
    }

    public offPartialResult(handler: (text: string) => void) {
        logger.debug("Removing partial result listener for STT instance ID:", this.instanceId);
        this.partialResultListeners.delete(handler);
    }

    public offError(handler: (error: STTError) => void) {
        logger.debug("Removing error listener for STT instance ID:", this.instanceId);
        this.errorListeners.delete(handler);
    }

    public removeAllListeners(event?: STTEventType): void {
        logger.debug("Removing all listeners for STT instance ID:", this.instanceId, "Event:", event);
        switch (event) {
            case "start":
                this.startListeners.clear();
                break;
            case "end":
                this.endListeners.clear();
                break;
            case "result":
                this.resultListeners.clear();
                break;
            case "partialResult":
                this.partialResultListeners.clear();
                break;
            case "error":
                this.errorListeners.clear();
                break;
            default:
                this.startListeners.clear();
                this.endListeners.clear();
                this.resultListeners.clear();
                this.partialResultListeners.clear();
                this.errorListeners.clear();
        }
    }

    private bindEvents(): void {
        logger.debug("Binding events for STT instance ID:", this.instanceId);
        if (!this.recognition) {
            throw new STTError(STTErrorCode.INSTANCE_NOT_INITIALIZED, "SpeechRecognition instance is not initialized.");
        }
        const r = this.recognition;

        r.onstart = () => {
            this.recognizing = true;
            this.emitStart();
        };

        r.onend = () => {
            this.recognizing = false;
            this.emitEnd();
        };

        r.onerror = (event) => {
            if (event.error === "no-speech") {
                this.emitError(new STTError(STTErrorCode.NO_SPEECH_DETECTED, "No speech detected"), event);
                return;
            }
            if (event.error === "aborted") {
                this.emitError(new STTError(STTErrorCode.ABORTED, "Speech recognition aborted"), event);
                return;
            }
            this.emitError(new STTError(STTErrorCode.GENERAL_ERROR, event.message), event);
        };

        r.onresult = (event: SpeechRecognitionEvent) => {
            logger.debug("STT result:", event);
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript;
                    this.emitResult(this.finalTranscript.trim());
                } else {
                    interim += transcript;
                }
            }

            if (interim) {
                this.emitPartialResult(interim.trim());
            }
        };
        logger.debug("Events bound for STT instance ID:", this.instanceId);
    }

    private emitStart(): void {
        this.startListeners.forEach(fn => fn());
    }

    private emitEnd(): void {
        this.endListeners.forEach(fn => fn());
    }

    private emitResult(text: string): void {
        logger.debug("Emitting Results");
        this.resultListeners.forEach(fn => fn(text));
    }

    private emitPartialResult(text: string): void {
        this.partialResultListeners.forEach(fn => fn(text));
    }

    private emitError(err: STTError, errorEvent?: SpeechRecognitionErrorEvent): void {
        this.errorListeners.forEach(fn => fn(err, errorEvent));
    }


    public async start(options: Partial<STTStartOptions> = {}): Promise<void> {
        await this.ensureReadyToStart();
        const { lang = "en-US", continuous = true, interimResults = true } = options;
        this.recognition!.lang = lang;
        this.recognition!.continuous = continuous;
        this.recognition!.interimResults = interimResults;
        this.finalTranscript = "";
        try {
            this.recognition!.start();
        } catch (err) {
            logger.error(err);
            const error = new STTError(STTErrorCode.GENERAL_ERROR, "Error starting speech recognition");
            error.stack = err instanceof Error ? err.stack : undefined;
            this.emitError(error);
            throw error;
        }
    }

    private async ensureReadyToStart(): Promise<void> {
        if (!this.recognition) {
            throw new STTError(STTErrorCode.INSTANCE_NOT_INITIALIZED, "SpeechRecognition instance is not initialized.");
        }
        const isGranted = await this.checkMicrophonePermission();
        if (!isGranted) {
            const err = new STTError(STTErrorCode.MIC_PERMISSION_DENIED, "Microphone permission was denied.");
            this.emitError(err);
            throw err;
        }
    }

    private async checkMicrophonePermission(): Promise<boolean> {
        if (!navigator.permissions) {
            logger.warn("Permissions API not supported, assuming microphone access is granted.");
            return true;
        }
        try {
            const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
            if(result.state === 'granted') {
                logger.debug("Microphone permission granted for STT instance ID:", this.instanceId);
                return true;
            }
            
            return result.state !== "denied";
        }
        catch (e) {
            console.warn("Permission check failed:", e);
            return true;
        }
    }


    public stop(): void {
        this.recognition?.stop();
    }

    public abort(): void {
        this.recognition?.abort();
    }

    public isRecognizing(): boolean {
        return this.recognizing;
    }

    public dispose(): void {
        this.abort();
        this.removeAllListeners();
    }

}