import { createContext, useContext } from "react";
import { EasySelectStore } from "./EasySelectStore";

export const EasySelectContext = createContext<EasySelectStore<any> | null>(null);

export const useEasySelectStore = <T = any>() => {
    const store = useContext(EasySelectContext) as EasySelectStore<T> | null;
    if (!store) {
        throw new Error("useEasySelectStore must be used within an EasySelectProvider");
    }
    return store;
};