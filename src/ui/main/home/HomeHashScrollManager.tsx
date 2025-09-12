import { useEffect } from "react";


export function HomeHashScrollManager() {
    useEffect(() => {
        const scrollToHash = () => {
            const raw = window.location.hash;
            if (!raw) return;
            const id = decodeURIComponent(raw.slice(1));
            const el = document.getElementById(id);
            if (!el) return;

            // Wait for layout/paint to finalize then scroll
            requestAnimationFrame(() => {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        };

        // Initial on mount
        scrollToHash();

        // Respond to hash changes (e.g., browser back/forward)
        window.addEventListener("hashchange", scrollToHash);
        return () => window.removeEventListener("hashchange", scrollToHash);
    }, []);

    return null;
}
