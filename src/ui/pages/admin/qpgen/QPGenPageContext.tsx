import { useContext, createContext } from "react";
import { QPGenPageStore } from "./QPGenPageStore";

export const QPGenPageContext = createContext<QPGenPageStore | null>(null);

export const useQPGenPageStore = () => {
    const context = useContext(QPGenPageContext);
    if (context === null) {
        throw new Error("useQPGenPageStore must be used within a QPGenPageProvider");
    }
    return context;
};