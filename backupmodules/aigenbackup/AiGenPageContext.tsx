import { createContext, useContext } from "react";
import { AiGenPageStore } from "./AiGenPageStore";

export const AiGenPageContext = createContext<AiGenPageStore | null>(null);

export const useAiGenPageStore = () => {
    const context = useContext(AiGenPageContext);
    if (!context) {
        throw new Error("useAiGenPageStore must be used within an AiGenPageProvider");
    }
    return context;
};
