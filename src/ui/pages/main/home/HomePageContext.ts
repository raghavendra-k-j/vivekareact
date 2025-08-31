import { createContext, useContext } from "react";
import { HomePageStore } from "./HomePageStore";

export const HomePageContext = createContext<HomePageStore | null>(null);

export function useHomePageStore() {
    const context = useContext(HomePageContext);
    if (!context) {
        throw new Error("useHomePageStore must be used within a HomePageProvider");
    }
    return context;
}
