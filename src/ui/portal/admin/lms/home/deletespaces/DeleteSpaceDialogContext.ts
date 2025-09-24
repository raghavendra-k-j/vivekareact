import { createContext, useContext } from "react";
import { DeleteSpaceDialogStore } from "./DeleteSpaceDialogStore";

export const DeleteSpaceDialogContext = createContext<DeleteSpaceDialogStore | null>(null);

export function useDeleteSpaceDialogStore(): DeleteSpaceDialogStore {
    const context = useContext(DeleteSpaceDialogContext);
    if (!context) {
        throw new Error("useDeleteSpaceDialogStore must be used within DeleteSpaceDialogProvider");
    }
    return context;
}

export const deleteSpaceDialogId = "delete-space-dialog";