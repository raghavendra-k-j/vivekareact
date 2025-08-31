import { useRef } from "react";
import { HomePageContext } from "./HomePageContext";
import { HomePageStore } from "./HomePageStore";
import { AppBar } from "./comp/AppBar";
import { FeaturesSection } from "./comp/FeaturesSection";
import { Footer } from "./comp/Footer";
import { HeroSection } from "./comp/HeroSection";
import { UseCasesSection } from "./comp/UseCasesSection";

export function HomePageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<HomePageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new HomePageStore();
    }
    return <HomePageContext.Provider value={storeRef.current}>
        {children}
    </HomePageContext.Provider>;
}

export default function HomePage() {
    return (
        <HomePageProvider>
            <HomePageInner />
        </HomePageProvider>
    );
}

function HomePageInner() {
    return (
        <div className="h-screen overflow-y-auto">
            <AppBar />
            <HeroSection />
            <FeaturesSection />
            <UseCasesSection />
            <Footer />
        </div>
    );
}