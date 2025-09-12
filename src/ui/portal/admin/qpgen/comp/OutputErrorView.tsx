import { AppError } from "~/core/error/AppError";
import { useQPGenPageStore } from "../QPGenPageContext";
import { CommonCenterCard } from "./CommonCard";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";

export function ErrorCard({ error }: { error: AppError }) {
    const store = useQPGenPageStore();
    return (
        <CommonCenterCard>
            <SimpleRetryableAppView
                appError={error}
                onRetry={() => store.generatePaper()}
            />
        </CommonCenterCard>
    );
}