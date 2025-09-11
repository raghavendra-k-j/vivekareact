import { useRef } from "react";
import { Outlet } from "react-router";
import { PortalLayoutContext } from "./PortalLayoutContext";
import { PortalLayoutStore } from "./PortalLayoutStore";

function PortalLayoutProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<PortalLayoutStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new PortalLayoutStore();
    }
    return (<PortalLayoutContext.Provider value={storeRef.current} >
        {children}
    </PortalLayoutContext.Provider>);
}

export default function PortalLayout() {
    return (<PortalLayoutProvider>
        <Outlet />
    </PortalLayoutProvider>);
}