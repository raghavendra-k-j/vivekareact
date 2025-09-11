import { createContext, useContext } from "react";
import { AuthLayoutStore } from "./AuthLayoutStore";

export const AuthLayoutContext = createContext<AuthLayoutStore | null>(null);

export function useAuthLayoutStore() {
    const context = useContext(AuthLayoutContext);
    if (!context) {
        throw new Error("useAuthLayoutStore must be used within a AuthLayoutProvider");
    }
    return context;
}