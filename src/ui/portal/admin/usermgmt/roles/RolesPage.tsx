import { useRef } from "react";
import { AdminPortalContainer } from "../../root/AdminPortalContainer";
import { RolesPageContext } from "./RolesPageContext";
import { RolesPageStore } from "./RolesPageStore";

function RolesPageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<RolesPageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new RolesPageStore();
    }
    return (
        <RolesPageContext.Provider value={storeRef.current}>
            {children}
        </RolesPageContext.Provider>
    );
}

export default function RolesPage() {
    return (
        <RolesPageProvider>
            <ProviderInner />
        </RolesPageProvider>
    );
}

function ProviderInner() {
    return (<AdminPortalContainer>
        <div>The portal here</div>
    </AdminPortalContainer>);
}
