import { createContext, useContext } from "react";
import { FormsSTTDialogStore } from "./FormSTTDialogStore";

export const FormsSTTDialogContext = createContext<FormsSTTDialogStore | null>(null);

export const useFormsSTTDialogStore = () => {
    const context = useContext(FormsSTTDialogContext);
    if (!context) {
        throw new Error("useFormsSTTDialogStore must be used within a FormsSTTDialogProvider");
    }
    return context;
}