import { AxiosError } from "axios";
import { AppError, type AppErrorProps } from "~/core/error/AppError";
import { logger } from "~/core/utils/logger";

type PyApiErrorProps = AppErrorProps & {
    statusCode?: number | null;
    errorCode?: string | null;
    debugMessage?: string | null;
}

export class PyApiError extends AppError {
    statusCode: number | null;
    errorCode: string | null;
    debugMessage: string | null;

    constructor({ statusCode, errorCode, debugMessage, ...props }: PyApiErrorProps) {
        super(props);
        this.statusCode = statusCode ?? null;
        this.errorCode = errorCode ?? null;
        this.debugMessage = debugMessage ?? null;
    }

    static fromAny(error: unknown): PyApiError {
        logger.error("PyApiError → fromAny", error);
        if (error instanceof AxiosError) {
            return PyApiError.fromAxiosError(error);
        }
        if (error instanceof Error) {
            return PyApiError.fromError(error);
        }
        return PyApiError.unknown();
    }

    static fromAxiosError(error: AxiosError): PyApiError {
        logger.error("PyApiError → fromAxiosError", error);

        const response = error.response as any;
        if (!response) {
            return PyApiError.networkError();
        }

        const data = response.data ?? {};
        const message: string = data.message ?? "Unknown error occurred";
        const description: string = data.description ?? "No additional description provided";
        const statusCode: number | null = data.status_code ?? error.status ?? null;
        const errorCode: string | null = data.error_code ?? null;
        const debugMessage: string | null = data.debug_message ?? null;

        return new PyApiError({
            message,
            description,
            statusCode,
            errorCode,
            debugMessage,
        });
    }

    static fromError(error: Error): PyApiError {
        return new PyApiError({
            message: "Unexpected error",
            description: "An unexpected error occurred. Please try again.",
            debugMessage: error.stack ?? null,
        });
    }

    static unknown(): PyApiError {
        return new PyApiError({
            message: "Something went wrong",
            description: "An unknown error occurred. Please try again.",
        });
    }

    static networkError(): PyApiError {
        return new PyApiError({
            message: "Network error",
            description: "Failed to connect to the server. Please check your internet connection.",
        });
    }

    get isBadRequest(): boolean {
        return this.statusCode === 400;
    }

    get isUnauthorized(): boolean {
        return this.statusCode === 401;
    }

    get isForbidden(): boolean {
        return this.statusCode === 403;
    }

    get isNotFound(): boolean {
        return this.statusCode === 404;
    }

    get isServerError(): boolean {
        return this.statusCode === 500;
    }

    get isRateLimited(): boolean {
        return this.statusCode === 429;
    }

    isServerIssue(): boolean {
        return this.statusCode !== null && this.statusCode >= 500 && this.statusCode < 600;
    }
}
