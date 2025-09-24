import { createContext, useContext } from "react";
import { RenameSpaceDialogStore } from "./RenameSpaceDialogStore";

export const RenameSpaceDialogContext = createContext<RenameSpaceDialogStore | null>(null);

export function useRenameSpaceDialogStore(): RenameSpaceDialogStore {
    const context = useContext(RenameSpaceDialogContext);
    if (!context) {
        throw new Error("useRenameSpaceDialogStore must be used within RenameSpaceDialogProvider");
    }
    return context;
}

export const renameSpaceDialogId = "rename-space-dialog";