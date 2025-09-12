import { useRef } from "react";
import { RootLayoutStore } from "../root/RootLayoutStore";
import { Outlet, useNavigate } from "react-router";
import { RootLayoutContext } from "../root/RootLayoutContext";

function RootLayoutProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<RootLayoutStore | null>(null);
    const navigate = useNavigate();
    if (storeRef.current === null) {
        storeRef.current = new RootLayoutStore({
            navigate: navigate
        });
    }
    return (
        <RootLayoutContext.Provider value={storeRef.current}>
            {children}
        </RootLayoutContext.Provider>
    );
}

export default function RootLayout() {
    return (
        <RootLayoutProvider>
            <Outlet />
        </RootLayoutProvider>
    );
}