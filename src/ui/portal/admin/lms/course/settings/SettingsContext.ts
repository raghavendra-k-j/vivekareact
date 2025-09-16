import { createContext, useContext } from 'react';
import { SettingsStore } from './SettingsStore';

export const SettingsContext = createContext<SettingsStore | null>(null);

export function useSettingsStore(): SettingsStore {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettingsStore must be used within a SettingsProvider');
    }
    return context;
}