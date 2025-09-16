import { createContext, useContext, ReactNode } from "react";
import { AiCreateSpaceDialogStore } from "./AiCreateSpaceDialogStore";

const AiCreateSpaceDialogContext = createContext<AiCreateSpaceDialogStore | null>(null);

export function useAiCreateSpaceDialogStore(): AiCreateSpaceDialogStore {
    const context = useContext(AiCreateSpaceDialogContext);
    if (!context) {
        throw new Error("useAiCreateSpaceDialogStore must be used within AiCreateSpaceDialogProvider");
    }
    return context;
}

export function AiCreateSpaceDialogProvider({
    children,
    store
}: {
    children: ReactNode;
    store: AiCreateSpaceDialogStore;
}) {
    return (
        <AiCreateSpaceDialogContext.Provider value={store}>
            {children}
        </AiCreateSpaceDialogContext.Provider>
    );
}