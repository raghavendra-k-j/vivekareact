import { useRef } from "react";
import { AuthLayoutContext } from "./AuthLayoutContext";
import { AuthLayoutStore } from "./AuthLayoutStore";
import clsx from "clsx";
import { AppBrandingFooter } from "../../components/footer/AppBrandingFooter";
import { AuthAppBar } from "../components/AuthAppBar";

export function AuthLayoutProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AuthLayoutStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = new AuthLayoutStore();
    }
    return (<AuthLayoutContext.Provider value={storeRef.current}>
        {children}
    </AuthLayoutContext.Provider>);
}

export default function AuthLayout({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={clsx("h-full flex flex-col", className)}>
            <AuthAppBar />
            <div className="flex-1 overflow-y-auto">
                <div className="min-h-[80vh]">{children}</div>
            </div>
            <AppBrandingFooter />
        </div>
    );
}
