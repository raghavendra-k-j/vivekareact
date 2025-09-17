import { createContext, useContext, ReactNode } from "react";
import { AddMembersDialogStore } from "./AddMembersDialogStore";

const AddMembersDialogContext = createContext<AddMembersDialogStore | null>(null);

export function useAddMembersDialogStore(): AddMembersDialogStore {
    const context = useContext(AddMembersDialogContext);
    if (!context) {
        throw new Error("useAddMembersDialogStore must be used within AddMembersDialogProvider");
    }
    return context;
}

export function AddMembersDialogProvider({ children, store }: { children: ReactNode; store: AddMembersDialogStore; }) {
    return (
        <AddMembersDialogContext.Provider
            value={store}>
            {children}
        </AddMembersDialogContext.Provider>
    );
}