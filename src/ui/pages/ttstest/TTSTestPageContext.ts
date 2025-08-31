import { createContext, useContext } from "react";
import { TTSTestPageStore } from "./TTSTestPageStore";

export const TTSTestPageContext = createContext<TTSTestPageStore | null>(null);

export function useTTSTestPageStore(): TTSTestPageStore {
    const context = useContext(TTSTestPageContext);
    if (!context) {
        throw new Error("useTTSTestPageStore must be used within a TTSTestPageProvider");
    }
    return context;
}