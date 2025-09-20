import { createContext, useContext } from "react";
import { FormDetailStore } from "./FormDetailStore";

export const FormDetailContext = createContext<FormDetailStore | null>(null);

export const useFormDetailStore = (): FormDetailStore => {
    const context = useContext(FormDetailContext);
    if (!context) {
        throw new Error("useFormDetailStore must be used within a FormDetailProvider");
    }
    return context;
};