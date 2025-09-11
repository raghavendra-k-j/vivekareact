import { useRef } from "react";
import { AuthLayoutContext } from "./AuthLayoutContext";
import { AuthLayoutStore } from "./AuthLayoutStore";
import { AuthAppBar } from "../portallayout/appbar/AuthAppBar";
import { AppBrandingFooter } from "../portallayout/footer/AppBrandingFooter";
import clsx from "clsx";

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
        <div className={clsx("bg-brand-gradient h-full flex flex-col", className)}>
            <AuthAppBar />
            <div className="flex-1 overflow-y-auto">
                <div className="min-h-[80vh]">{children}</div>
            </div>
            <AppBrandingFooter />
        </div>
    );
}
