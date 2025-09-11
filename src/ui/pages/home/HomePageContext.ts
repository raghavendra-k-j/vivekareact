import { createContext, useContext } from "react";
import { HomePageStore } from "./HomePageStore";

export const HomePageContext = createContext<HomePageStore | null>(null);

export const useHomePageStore = () => {
    const store = useContext(HomePageContext);
    if (!store) {
        throw new Error("useHomePageStore must be used within a HomePageProvider");
    }
    return store;
};
