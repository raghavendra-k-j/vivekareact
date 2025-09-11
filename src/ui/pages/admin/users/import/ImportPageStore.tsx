import { createContext, useContext } from "react";
import { ImportUsersPageStore } from "./ImportPageContext";

export const ImportUsersPageContext = createContext<ImportUsersPageStore | null>(null);

export const useImportUsersPageStore = () => {
    const store = useContext(ImportUsersPageContext);
    if (!store) {
        throw new Error("useImportUsersPageStore must be used within a ImportUsersPageContext.Provider");
    }
    return store;
};