import { createContext, useContext } from "react";
import { RolesPageStore } from "./RolesPageStore";

export const RolesPageContext = createContext<RolesPageStore | null>(null);

export const useRolesPageStore = () => {
    const store = useContext(RolesPageContext);
    if (!store) {
        throw new Error("useRolesPageStore must be used within a RolesPageContext.Provider");
    }
    return store;
};