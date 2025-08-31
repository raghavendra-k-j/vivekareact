import { AxiosError } from "axios";
import { AppError, type AppErrorProps } from "~/core/error/AppError";
import { logger } from "~/core/utils/logger";

type ApiErrorProps = AppErrorProps & {
    statusCode?: number | null;
}

export class ApiError extends AppError {
    statusCode: number | null;

    constructor({ statusCode, ...props }: ApiErrorProps) {
        super(props);
        this.statusCode = statusCode ?? null;
    }

    static fromAny(error: unknown): ApiError {
        logger.error("error", error);
        if (error instanceof AxiosError) {
            return ApiError.fromAxiosError(error);
        }
        if (error instanceof Error) {
            return ApiError.fromError(error);
        }
        return ApiError.unknown();
    }

    static fromAxiosError(error: AxiosError): ApiError {
        logger.error("fromAxiosError", error, error.stack);
        const response = error.response as any;

        if (!response) {
            return ApiError.parseError();
        }

        const data = response.data as any;
        const errorCode: string | null = data["errorCode"] as string | null;
        const message: string = data["message"] as string;
        const description: string | null = data["description"] as string | null;
        const statusCode: number | null = error.status as number | null;

        return new ApiError({
            message: message,
            description: description,
            statusCode: statusCode,
            errorCode: errorCode,
            data: data,
        });
    }

    static unknown(): ApiError {
        return new ApiError({
            message: "Something went wrong",
            description: "An unexpected error occurred, Please try again",
        });
    }

    static parseError(): ApiError {
        return new ApiError({
            message: "Unknown network error",
            description: "An error occurred while communicating with the server. Please try again",
        });
    }

    static cancelled(): ApiError {
        return new ApiError({
            message: "Request cancelled",
            statusCode: 499,
        });
    }

    get isCancelled(): boolean {
        return this.statusCode === 499;
    }

    get isNotFound(): boolean {
        return this.statusCode === 404;
    }

    get isUnauthorized(): boolean {
        return this.statusCode === 401;
    }

    get isForbidden(): boolean {
        return this.statusCode === 403;
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

    static fromError(error: Error): ApiError {
        return new ApiError({
            message: "Something went wrong",
            description: "An error occurred. Please try again",
            debugMessage: error.stack,
        });
    }
}
