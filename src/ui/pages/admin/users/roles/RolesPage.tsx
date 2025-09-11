import { useRef } from "react";
import { RolesPageStore } from "./RolesPageStore";
import { RolesPageContext, useRolesPageStore } from "./RolesPageContext";
import { AdminPortalContainer } from "~/ui/pages/portallayout/adminportal/AdminPortalContainer";

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
    const store = useRolesPageStore();
    return (<AdminPortalContainer>
        <div>The portal here</div>
    </AdminPortalContainer>);
}
