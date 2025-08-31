import { useEffect, useRef } from "react";
import { useFormsSTTDialogStore } from "../FormSTTDialogContext";
import { Observer } from "mobx-react-lite";
import { AiSTTContentView } from "./AiSTTContentView";
import { reaction } from "mobx";
import { ErrorBanner } from "./ErrorBanner";
import clsx from "clsx";


export function AiOutputView() {
    const store = useFormsSTTDialogStore();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const disposer = reaction(
            () => [store.recorderStore.liveTranscription],
            () => {
                const el = containerRef.current;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            }
        );
        return () => disposer();
    }, [store]);

    return (
        <div ref={containerRef} className="flex-1 overflow-auto px-6">
            <AiSTTContentView />

            <Observer>
                {() => {
                    const className = clsx(
                        "text-base-m text-secondary mt-2",
                        store.resVm.isContentEmpty() && "text-center",
                        store.formatState.isLoading && "animate-pulse"
                    );
                    let liveTranscription = "";
                    if (store.recorderStore.liveTranscription) {
                        liveTranscription = store.recorderStore.liveTranscription;
                    }
                    else if( store.formatState.isLoading) {
                        liveTranscription = store.formatStore.queuedTranscription;
                    }
                    
                    if (store.formatState.isError) {
                        const appError = store.formatState.error;
                        return (
                            <ErrorBanner
                                message={appError.message}
                                description={appError.description}
                                onRetry={() => store.formatStore.handleRetryFormatting()}
                                onCancel={() => store.formatStore.handleIgnoreTranscriptionError()}
                            />
                        );
                    }

                    return (
                        <div className={className}>
                            {liveTranscription}
                        </div>
                    );
                }}
            </Observer>
        </div>
    );
}
