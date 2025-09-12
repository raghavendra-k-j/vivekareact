import { useRef } from "react";
import { ImportUsersPageStore } from "./ImportPageContext";
import { ImportUsersPageContext } from "./ImportPageStore";
import { AdminPortalContainer } from "../../root/AdminPortalContainer";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<ImportUsersPageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new ImportUsersPageStore();
    }
    return (
        <ImportUsersPageContext.Provider value={storeRef.current}>
            {children}
        </ImportUsersPageContext.Provider>
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
