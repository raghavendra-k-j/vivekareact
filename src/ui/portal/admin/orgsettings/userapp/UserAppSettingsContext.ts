import { createContext, useContext } from 'react';
import { UserAppSettingsStore } from './UserAppSettingsStore';

export const UserAppSettingsContext = createContext<UserAppSettingsStore | null>(null);


export function useUserAppSettingsContext(): UserAppSettingsStore {
    const context = useContext(UserAppSettingsContext);
    if (!context) {
        throw new Error('useUserAppSettingsContext must be used within a UserAppSettingsProvider');
    }
    return context;
}