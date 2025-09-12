import { createContext, useContext } from "react";
import { TopUpPageStore } from "./TopUpPageStore";

export const TopUpPageContext = createContext<TopUpPageStore | null>(null);

export function useTopUpPageStore(): TopUpPageStore {
    const store = useContext(TopUpPageContext);
    if (!store) {
        throw new Error("TopUpPageStore is not provided in the context");
    }
    return store;
}
