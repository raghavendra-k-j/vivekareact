export type AppErrorProps = {
    message: string;
    description?: string | null;
    debugMessage?: string | null;
    errorCode?: string | null;
    data?: any;
}

export class AppError extends Error {
    message: string;
    description: string | null;
    debugMessage: string | null;
    errorCode: string | null;
    data?: any;

    constructor(props: AppErrorProps) {
        super(props.message);
        this.message = props.message;
        this.description = props.description ?? null;
        this.debugMessage = props.debugMessage ?? null;
        this.errorCode = props.errorCode ?? null;
        this.data = props.data ?? null;
    }

    static fromAny(error: unknown): AppError {
        if (error instanceof AppError) {
            return error;
        }
        if (error instanceof Error) {
            return AppError.fromError(error);
        }
        return AppError.unknown();
    }


    static unknown(): AppError {
        return new AppError({
            message: "Something went wrong",
            description: "An unknown error occurred. Please try again",
        });
    }

    static unimplemented(message?: string): AppError {
        return new AppError({
            message: message ?? "Feature not implemented",
            description: "This feature is not yet implemented",
            debugMessage: message
        });
    }


    static fromError(error: Error): AppError {
        return new AppError({
            message: "Something went wrong",
            description: "An error occurred. Please try again",
            debugMessage: error.stack,
        });
    }

}
