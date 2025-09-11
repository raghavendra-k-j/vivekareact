import { createContext, useContext } from "react";
import { UsersPageStore } from "./UsersPageStore";

export const UsersPageContext = createContext<UsersPageStore | null>(null);

export const useUsersPageStore = () => {
    const store = useContext(UsersPageContext);
    if (!store) {
        throw new Error("useUsersPageStore must be used within a UsersPageContext.Provider");
    }
    return store;
};