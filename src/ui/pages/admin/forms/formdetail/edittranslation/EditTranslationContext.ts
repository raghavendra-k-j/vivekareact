import { createContext, useContext } from "react";
import { EditTranslationStore } from "./EditTranslationStore";

export const EditTranslationContext = createContext<EditTranslationStore | null>(null);

export function useEditTranslationStore(): EditTranslationStore {
    const store = useContext(EditTranslationContext);
    if (!store) {
        throw new Error("EditTranslationStore is not provided in the context");
    }
    return store;
}