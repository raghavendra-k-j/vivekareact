import { createContext, useContext } from 'react';
import { EntityDictSettingsStore } from './EntityDictSettingsStore';

export const EntityDictSettingsContext = createContext<EntityDictSettingsStore | null>(null);


export function useEntityDictSettingsStore(): EntityDictSettingsStore {
    const context = useContext(EntityDictSettingsContext);
    if (!context) {
        throw new Error('useEntityDictSettingsStore must be used within a provider');
    }
    return context;
}