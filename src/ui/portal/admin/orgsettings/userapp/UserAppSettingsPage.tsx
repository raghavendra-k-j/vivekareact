import { ReactNode, useRef } from "react";
import { UserAppSettingsStore } from "./UserAppSettingsStore";
import { UserAppSettingsContext, useUserAppSettingsContext } from "./UserAppSettingsContext";


function UserAppSettingsProvider({ children }: { children: ReactNode }) {
    const store = useRef<UserAppSettingsStore | null>(null);
    if (store.current === null) {
        store.current = new UserAppSettingsStore();
    }
    return <UserAppSettingsContext.Provider value={store.current}>
        {children}
    </UserAppSettingsContext.Provider>;
}

export default function UserAppSettingsPage() {
    return (<UserAppSettingsProvider>
        <PageInner />
    </UserAppSettingsProvider>
    );
}

function PageInner() {
    const context = useUserAppSettingsContext();
    return (<div>
        <div>User App Settings</div>
        <div>Context available: {context ? 'Yes' : 'No'}</div>
    </div>);
}