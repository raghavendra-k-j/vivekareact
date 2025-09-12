import clsx from "clsx";
import { useRef } from "react";
import { HomeHashScrollManager } from "./HomeHashScrollManager";
import { HomePageContext } from "./HomePageContext";
import { HomePageStore } from "./HomePageStore";
import { FeaturesSection } from "./comp/FeaturesSection";
import { HeroSection } from "./comp/HeroSection";
import { MainLayoutContainer } from "./comp/MainLayoutContainer";
import { PricingSection } from "./comp/PricingSection";
import { UseCasesSection } from "./comp/UseCasesSection";

export function HomePageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<HomePageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new HomePageStore();
    }
    return (
        <HomePageContext.Provider value={storeRef.current}>
            {children}
        </HomePageContext.Provider>
    );
}

export default function HomePage() {
    return (
        <HomePageProvider>
            <HomePageInner />
        </HomePageProvider>
    );
}

function HomePageInner() {
    return (<MainLayoutContainer>
        <HomeHashScrollManager />
        <HomeContent />
    </MainLayoutContainer>);
}

function HomeContent() {
    return (<main>
        <BaseSection id="home">
            <HeroSection />
        </BaseSection>
        <BaseSection id="features">
            <FeaturesSection />
        </BaseSection>
        <BaseSection id="use-cases">
            <UseCasesSection />
        </BaseSection>
        <BaseSection id="pricing">
            <PricingSection />
        </BaseSection>
    </main>);
}


function BaseSection({ id, children, className }: { id: string, children?: React.ReactNode, className?: string }) {
    return (
        <section
            id={id}
            className={clsx("scroll-mt-[56px]", className)}
        >
            {children ? children : (id).toUpperCase()}
        </section>
    );
}