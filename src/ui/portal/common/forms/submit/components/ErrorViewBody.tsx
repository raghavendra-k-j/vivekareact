import { ApiError } from "~/infra/errors/ApiError";
import { Button } from "~/ui/widgets/button/Button";
import { useSubmitStore } from "../SubmitContext";

export function ErrorViewBody() {
    const store = useSubmitStore();
    const appError = store.formDetailState.error;

    const handleRetry = () => store.loadFormDetail();

    const renderButtons = () => {
        if (appError instanceof ApiError) {
            if (appError.isUnauthorized) {
                return (
                    <Button onClick={() => { store.appStore.navigateToLogin() }}>
                        Log In to Continue
                    </Button>
                );
            }
            else if (appError.isForbidden) {
                return (
                    <Button onClick={() => { store.appStore.logoutAndGoToLogin() }}>
                        Log In with Another Account
                    </Button>
                );
            }
            else {
                return (
                    <Button onClick={handleRetry}>
                        Retry
                    </Button>
                );
            }
        }
        return (
            <Button onClick={handleRetry}>
                Retry
            </Button>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div className="text-default text-base font-semibold">{appError.message}</div>
            <div className="text-secondary text-sm mt-1">{appError.description}</div>
            <div className="mt-4 flex flex-col gap-2">
                {renderButtons()}
            </div>
        </div>
    );
}
