import { createContext, useContext } from 'react';
import { GeneralSettingsStore } from './GeneralSettingsStore';

export const GeneralSettingsContext = createContext<GeneralSettingsStore | null>(null);

export function useGeneralSettingsStore(): GeneralSettingsStore {
    const context = useContext(GeneralSettingsContext);
    if (!context) {
        throw new Error('useGeneralSettingsStore must be used within a GeneralSettingsProvider');
    }
    return context;
}