import { createContext, useContext } from 'react';
import { OrgSettingsStore } from './OrgSettingsStore';

export const OrgSettingsContext = createContext<OrgSettingsStore | null>(null);


export function useOrgSettingsStore(): OrgSettingsStore {
    const context = useContext(OrgSettingsContext);
    if (!context) {
        throw new Error('useOrgSettingsStore must be used within an OrgSettingsProvider');
    }
    return context;
}
