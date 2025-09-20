import { createContext, useContext } from "react";
import { UserPortalStore } from "./UserPortalStore";

export const UserPortalContext = createContext<UserPortalStore | null>(null);

export const useUserPortalStore = () => {
    const store = useContext(UserPortalContext);
    if (!store) {
        throw new Error("useUserPortalStore must be used within a UserPortalContext");
    }
    return store;
};