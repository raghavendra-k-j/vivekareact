import clsx from "clsx";
import { Loader, Mic, MicOff } from "lucide-react";
import styles from "./styles.module.css";
import { STTDataState } from "~/ui/utils/STTDataState";
import { DataState } from "~/ui/utils/DataState";

export type ComputedSTTProps = {
    isRecording: boolean;
    buttonDisabled: boolean;
    message: string;
    description: string | null;
    iconClassName: string;
    Icon: React.ElementType;
};



type ComputeSTTStateProps = {
    sttState: STTDataState;
    formatState: DataState<void>;
}

export function computeSTTState({sttState, formatState}: ComputeSTTStateProps): ComputedSTTProps {
    let Icon;
    let iconClassName;
    let buttonDisabled = true;
    let message = "";
    let description = null;

    if (sttState.isListening) {
        message = "Listening...";
        buttonDisabled = false; // Allow stopping
        iconClassName = clsx(styles.micButton, styles.listening);
        Icon = MicOff;
    }
    else if (sttState.isWaitingToStart) {
        message = "Starting...";
        buttonDisabled = true; // Disable button while waiting to start
        iconClassName = clsx(styles.micButton, styles.waiting);
        Icon = MicOff;
    }
    else if (sttState.isWaitingToEnd) {
        message = "Stopping...";
        buttonDisabled = true; // Disable button while waiting to end
        iconClassName = clsx(styles.micButton, styles.waiting);
        Icon = MicOff;
    }
    else if (formatState.isLoading) {
        message = "Processing...";
        buttonDisabled = true; // Disable button while loading
        iconClassName = clsx(styles.micButton, "animate-spin");
        Icon = Loader;
    }
    else if(sttState.isError) {
        const appError = sttState.error!;
        message = appError.message;
        description = appError.description;
        buttonDisabled = false; // Allow retrying of start
        iconClassName = clsx(styles.micButton);
        Icon = MicOff;
    }
    else {
        message = "Click Mic to start";
        buttonDisabled = false; // Allow starting
        iconClassName = styles.micButton;
        Icon = Mic;
    }
    return {
        isRecording: sttState.isListening,
        buttonDisabled: buttonDisabled,
        message: message,
        description: description,
        iconClassName: iconClassName,
        Icon: Icon
    };
}
