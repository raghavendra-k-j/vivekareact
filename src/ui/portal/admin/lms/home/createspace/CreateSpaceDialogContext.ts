import { createContext, useContext } from "react";
import { CreateSpaceDialogStore } from "./CreateSpaceDialogStore";

export const CreateSpaceDialogContext = createContext<CreateSpaceDialogStore | null>(null);

export function useCreateSpaceDialogStore(): CreateSpaceDialogStore {
    const context = useContext(CreateSpaceDialogContext);
    if (!context) {
        throw new Error("useCreateSpaceDialogStore must be used within CreateSpaceDialogProvider");
    }
    return context;
}

export const createSpaceDialogId = "create-space-dialog";