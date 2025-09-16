import { createContext, useContext } from 'react';
import { ContentStore } from './ContentStore';

export const ContentContext = createContext<ContentStore | null>(null);

export function useContentStore(): ContentStore {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContentStore must be used within a ContentProvider');
    }
    return context;
}