import { createContext, useContext } from "react";
import { SignUpPageStore } from "./SignUpPageStore";

export const SignUpPageContext = createContext<SignUpPageStore | null>(null);

export const useSignUpPageStore = () => {
    const store = useContext(SignUpPageContext);
    if (!store) {
        throw new Error("useSignUpPageStore must be used within a SignUpPageProvider");
    }
    return store;
};