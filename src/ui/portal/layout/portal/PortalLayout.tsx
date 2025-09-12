import { useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { getAuthService } from "../bootApp";
import { useAppStore } from "../app/AppContext";
import { PortalLayoutContext } from "./PortalLayoutContext";
import { PortalLayoutStore } from "./PortalLayoutStore";

function PortalLayoutProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<PortalLayoutStore | null>(null);
    const appStore = useAppStore();
    const navigate = useNavigate();
    if (!storeRef.current) {
        storeRef.current = new PortalLayoutStore({
            appStore: appStore,
            authService: getAuthService(),
            navigate: navigate,
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