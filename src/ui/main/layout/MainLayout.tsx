import { useEffect } from "react";
import { Outlet } from "react-router";
import { BaseEnv } from "~/core/config/BaseEnv";

export default function MainLayout() {
    useEffect(() => {
        if (document.getElementById("tawk-script")) return;
        const s1 = document.createElement("script");
        s1.id = "tawk-script";
        s1.async = true;
        s1.src = `${BaseEnv.instance.tawkToPropertyUrl}`
        s1.setAttribute("crossorigin", "*");
        const s0 = document.getElementsByTagName("script")[0];
        s0.parentNode?.insertBefore(s1, s0);
        return () => {
            s1.remove();
            (window as any).Tawk_API = undefined;
        };
    }, []);

    return <div className="bg-brand-gradient h-full overflow-y-hidden"><Outlet /></div>
}
