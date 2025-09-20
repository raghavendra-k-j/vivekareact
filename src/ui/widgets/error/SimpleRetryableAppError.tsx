import { AppError } from "~/core/error/AppError";
import { SimpleErrorView } from "./SimpleErrorView";
import { Button } from "../button/Button";

export type SimpleRetryableAppErrorViewProps = {
    appError: AppError;
    onRetry: () => void;
    className?: string;
};

export function SimpleRetryableAppView({
    appError,
    onRetry,
    className = "",
}: SimpleRetryableAppErrorViewProps) {
    return (
        <SimpleErrorView
            message={appError.message}
            description={appError.description}
            actions={[
                <Button onClick={onRetry} key="retry" >
                    Retry
                </Button>
            ]}
            className={className}
        />
    );
}
