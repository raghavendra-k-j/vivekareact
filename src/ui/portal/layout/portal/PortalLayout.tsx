import { useRef } from "react";
import { Outlet } from "react-router";
import { useAppStore } from "../app/AppContext";
import { PortalLayoutContext } from "./PortalLayoutContext";
import { PortalLayoutStore } from "./PortalLayoutStore";

function PortalLayoutProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<PortalLayoutStore | null>(null);
    const appStore = useAppStore();
    if (!storeRef.current) {
        storeRef.current = new PortalLayoutStore({
            appStore: appStore,
        });
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