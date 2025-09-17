import { Observer } from "mobx-react-lite";
import { useAiCreateSpaceDialogStore } from "./AiCreateSpaceDialogContext";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { HierarchyPreview } from "./HierarchyPreview";
import { BackButtonIcon } from "~/ui/components/buttons/BackButtonIcon";
import { RefreshCw } from "lucide-react";
import { Button } from "~/ui/widgets/button/Button";

function HeaderView() {
    const store = useAiCreateSpaceDialogStore();
    return (
        <Observer>
            {() => {
                const getTitle = () => {
                    if (store.generateState.isLoading) {
                        return "Generating your structure...";
                    }
                    if (store.generateState.isData) {
                        return "Structure Generated";
                    }
                    if (store.generateState.isError) {
                        return "Generation Failed";
                    }
                    return "Processing...";
                };
                return (
                    <div className="flex flex-row items-center justify-between min-h-[48px] px-3 py-2 bg-surface border-b border-default rounded-t-[var(--dimen-dialog-radius)]">
                        <div className="flex items-center space-x-3">
                            <BackButtonIcon onClick={() => store.resetToPromptView()} />
                            <h1 className="text-base font-semibold text-strong">
                                {getTitle()}
                            </h1>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
}

function LoadingView() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8">
            {/* Pulsing circle animation */}
            <div className="relative">
                <div className="w-16 h-16 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-16 h-16 bg-primary/40 rounded-full animate-ping"></div>
                <div className="absolute inset-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                </div>
            </div>

            {/* Loading text */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-strong">
                    Generating your structure...
                </h3>
            </div>
        </div>
    );
}

function MainContentView() {
    const store = useAiCreateSpaceDialogStore();
    return (
        <div className="flex-1 overflow-auto">
            <Observer>
                {() => store.generateState.when({
                    init: () => <LoadingView />,
                    loading: () => <LoadingView />,
                    loaded: () => <HierarchyPreview />,
                    error: (error) => (
                        <div className="flex items-center justify-center p-8 overflow-y-auto">
                            <SimpleRetryableAppView
                                appError={error}
                                onRetry={() => store.generateStructureFromPrompt()}
                            />
                        </div>
                    )
                })}
            </Observer>
        </div>
    );
}

function FooterView() {
    const store = useAiCreateSpaceDialogStore();
    return (
        <Observer>
            {() => {
                const isLoading = store.createState.isLoading;
                const canCreate = store.canStartCreation;

                return (
                    <div className="flex items-center justify-end space-x-3 px-4 py-3 bg-surface border-t border-default rounded-b-[var(--dimen-dialog-radius)]">
                        <Button
                            variant="outline"
                            color="secondary"
                            onClick={() => store.resetToPromptView()}
                            disabled={isLoading}
                        >
                            Try another prompt
                        </Button>
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={() => store.startStructureCreation()}
                            disabled={!canCreate || isLoading}
                            loading={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create the structure"}
                        </Button>
                    </div>
                );
            }}
        </Observer>
    );
}

// Main Output View Component
export function AiCreateSpaceOutputView() {
    const store = useAiCreateSpaceDialogStore();
    return (
        <Observer>
            {() => (
                <div className="flex flex-col h-full bg-background rounded-[var(--dimen-dialog-radius)]">
                    <HeaderView />
                    <MainContentView />
                    {store.generateState.isData && <FooterView />}
                </div>
            )}
        </Observer>
    );
}

