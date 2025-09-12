import { useRef } from "react";
import { UsersPageContext } from "./UsersPageContext";
import { UsersPageStore } from "./UsersPageStore";
import { AdminPortalContainer } from "../../root/AdminPortalContainer";

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
    return (<AdminPortalContainer>
        <div>The portal here</div>
    </AdminPortalContainer>);
}
