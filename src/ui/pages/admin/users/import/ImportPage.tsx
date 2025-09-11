import { useRef } from "react";
import { AdminPortalContainer } from "../../../portallayout/adminportal/AdminPortalContainer";
import { ImportUsersPageStore } from "./ImportPageContext";
import { ImportUsersPageContext, useImportUsersPageStore } from "./ImportPageStore";

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
    const store = useImportUsersPageStore();
    return (<AdminPortalContainer>
        <div>The portal here</div>
    </AdminPortalContainer>);
}
