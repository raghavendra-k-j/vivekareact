export enum STTErrorCode {
    SPEECH_NOT_SUPPORTED = "SPEECH_NOT_SUPPORTED",
    GENERAL_ERROR = "GENERAL_ERROR",
    ALREADY_STARTED = "ALREADY_STARTED",
    INSTANCE_NOT_INITIALIZED = "INSTANCE_NOT_INITIALIZED",
    MIC_PERMISSION_DENIED = "MIC_PERMISSION_DENIED",
    NO_SPEECH_DETECTED = "NO_SPEECH_DETECTED",
    ABORTED = "ABORTED"
}

export type STTEventType = "start" | "end" | "result" | "partialResult" | "error";

export class STTError extends Error {

    code: STTErrorCode;

    constructor(code: STTErrorCode, message: string) {
        super(message);
        this.code = code;
        this.name = "STTError";
        Object.setPrototypeOf(this, STTError.prototype);
    }

    static general(message: string): STTError {
        return new STTError(STTErrorCode.GENERAL_ERROR, message);
    }
}

export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}