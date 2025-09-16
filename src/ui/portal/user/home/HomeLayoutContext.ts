import { createContext, useContext } from "react";
import { HomeLayoutStore } from "./HomeLayouteStore";

export const HomeLayoutContext = createContext<HomeLayoutStore | null>(null);

export const useHomeLayoutStore = () => {
    const store = useContext(HomeLayoutContext);
    if (!store) {
        throw new Error("useHomeLayoutStore must be used within a HomeLayoutStore");
    }
    return store;
};