import { createContext, useContext } from "react";
import { CategoriesPageStore } from "./CategoriesPageStore";

export const CategoriesPageContext = createContext<CategoriesPageStore | null>(null);

export const useCategoriesPageStore = () => {
    const store = useContext(CategoriesPageContext);
    if (!store) {
        throw new Error("useCategoriesPageStore must be used within a CategoriesPageContext.Provider");
    }
    return store;
};
