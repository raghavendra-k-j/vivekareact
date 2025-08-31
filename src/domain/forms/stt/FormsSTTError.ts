import { AppError, AppErrorProps } from "~/core/error/AppError";


export class FormsSTTError extends AppError {

    constructor(props: AppErrorProps) {
        super(props);
    }

    static fromUnknown(error: unknown): FormsSTTError {
        const base = AppError.fromAny(error);
        return new FormsSTTError({
            message: "Unknown AI model error",
            description: "An unexpected error occurred while contacting the AI transcription model.",
            debugMessage: base.debugMessage ?? base.stack,
        });
    }

    static fromAny(error: any): FormsSTTError {
        if (error instanceof Error) {
            return new FormsSTTError({
                message: "AI model error",
                description: error.message,
                debugMessage: error.stack,
            });
        }
        else {
            return FormsSTTError.unknown();
        }
    }


    static fromDescription(description: string): FormsSTTError {
        return new FormsSTTError({
            message: "AI model error",
            description: description,
            debugMessage: description,
        });
    }

    static unknown(): FormsSTTError {
        return new FormsSTTError({
            message: "Unknown AI model error",
            description: "An unexpected error occurred while contacting the AI transcription model.",
            debugMessage: "Unknown error",
        });
    }

}
