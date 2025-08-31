import { createContext, useContext } from "react";
import { MyPlanPageStore } from "./MyPlanPageStore";

export const MyPlanPageContext = createContext<MyPlanPageStore | null>(null);

export function useMyPlanPageStore(): MyPlanPageStore {
    const store = useContext(MyPlanPageContext);
    if (!store) {
        throw new Error("BalancePageStore is not provided in the context");
    }
    return store;
}