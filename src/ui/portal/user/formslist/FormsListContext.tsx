import { createContext, useContext } from "react";
import { FormsListStore } from "./FormsListStore";

export const FormsListContext = createContext<FormsListStore | null>(null);

export const useFormsListStore = (): FormsListStore => {
    const context = useContext(FormsListContext);
    if (!context) {
        throw new Error("useFormsListStore must be used within a FormsListProvider");
    }
    return context;
};