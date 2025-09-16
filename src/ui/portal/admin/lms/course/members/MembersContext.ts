import { createContext, useContext } from 'react';
import { MembersStore } from './MembersStore';

export const MembersContext = createContext<MembersStore | null>(null);

export function useMembersStore(): MembersStore {
    const context = useContext(MembersContext);
    if (!context) {
        throw new Error('useMembersStore must be used within a MembersProvider');
    }
    return context;
}