import { createContext, useContext } from "react";
import { WebPageStore } from "./WebPageStore";

export const WebPageContext = createContext<WebPageStore | null>(null);

export function useWebPageContext() {
    const context = useContext(WebPageContext);
    if (!context) {
        throw new Error("useWebPageContext must be used within a WebPageProvider");
    }
    return context;
}
