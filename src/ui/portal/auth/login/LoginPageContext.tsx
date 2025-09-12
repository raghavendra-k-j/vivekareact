import { createContext, useContext } from "react";
import { LoginPageStore } from "./LoginPageStore";

export const LoginPageContext = createContext<LoginPageStore | null>(null);

export function useLoginPageStore() {
    const store = useContext(LoginPageContext);
    if (!store) {
        throw new Error("useLoginPageStore must be used within a LoginPageProvider.");
    }
    return store;
}