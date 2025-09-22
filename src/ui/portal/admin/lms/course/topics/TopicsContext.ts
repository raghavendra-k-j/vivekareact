import { createContext, useContext } from 'react';
import { TopicsStore } from './TopicsStore';

export const TopicsContext = createContext<TopicsStore | null>(null);

export function useTopicsStore(): TopicsStore {
    const context = useContext(TopicsContext);
    if (!context) {
        throw new Error('useTopicsStore must be used within a TopicsProvider');
    }
    return context;
}