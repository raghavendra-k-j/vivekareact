import React, { useRef } from "react";
import { TopUpPageStore } from "./TopUpPageStore";
import { TopUpPageContext } from "./TopUpPageContext";

export function TopUpPageProvider({ children }: { children: React.ReactNode }) {
    const store = useRef<TopUpPageStore | null>(null);
    if (!store.current) {
        store.current = new TopUpPageStore();
    }
    return (
        <TopUpPageContext.Provider value={store.current}>
            {children}
        </TopUpPageContext.Provider>
    );
}
