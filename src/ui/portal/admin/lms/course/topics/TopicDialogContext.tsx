import { createContext, useContext, ReactNode } from "react";
import { TopicDialogStore } from "./TopicDialogStore";

const TopicDialogContext = createContext<TopicDialogStore | null>(null);

export function useTopicDialogStore(): TopicDialogStore {
    const context = useContext(TopicDialogContext);
    if (!context) {
        throw new Error("useTopicDialogStore must be used within TopicDialogProvider");
    }
    return context;
}

export function TopicDialogProvider({ children, store }: { children: ReactNode; store: TopicDialogStore; }) {
    return (
        <TopicDialogContext.Provider
            value={store}>
            {children}
        </TopicDialogContext.Provider>
    );
}