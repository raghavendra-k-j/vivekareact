import { createContext, useContext } from 'react';
import { ReportsStore } from './ReportsStore';

export const ReportsContext = createContext<ReportsStore | null>(null);

export function useReportsStore(): ReportsStore {
    const context = useContext(ReportsContext);
    if (!context) {
        throw new Error('useReportsStore must be used within a ReportsProvider');
    }
    return context;
}