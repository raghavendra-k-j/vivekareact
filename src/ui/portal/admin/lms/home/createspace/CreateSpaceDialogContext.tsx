import { createContext, useContext, ReactNode } from "react";
import { CreateSpaceDialogStore } from "./CreateSpaceDialogStore";

const CreateSpaceDialogContext = createContext<CreateSpaceDialogStore | null>(null);

export function useCreateSpaceDialogStore(): CreateSpaceDialogStore {
    const context = useContext(CreateSpaceDialogContext);
    if (!context) {
        throw new Error("useCreateSpaceDialogStore must be used within CreateSpaceDialogProvider");
    }
    return context;
}

export function CreateSpaceDialogProvider({
    children,
    store
}: {
    children: ReactNode;
    store: CreateSpaceDialogStore;
}) {
    return (
        <CreateSpaceDialogContext.Provider value={store}>
            {children}
        </CreateSpaceDialogContext.Provider>
    );
}