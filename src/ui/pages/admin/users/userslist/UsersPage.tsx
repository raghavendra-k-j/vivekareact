import { useRef } from "react";
import { UsersPageContext, useUsersPageStore } from "./UsersPageContext";
import { AdminPortalContainer } from "../../../portallayout/adminportal/AdminPortalContainer";
import { UsersPageStore } from "./UsersPageStore";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<UsersPageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new UsersPageStore();
    }
    return (
        <UsersPageContext.Provider value={storeRef.current}>
            {children}
        </UsersPageContext.Provider>
    );
}

export default function UsersPage() {
    return (
        <PageProvider>
            <ProviderInner />
        </PageProvider>
    );
}

function ProviderInner() {
    const store = useUsersPageStore();
    return (<AdminPortalContainer>
        <div>The portal here</div>
    </AdminPortalContainer>);
}
