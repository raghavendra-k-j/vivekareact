import { MainAppBar } from "../layout/compoents/MainAppBar";
import { MainLayoutContainer } from "./comp/MainLayoutContainer";
import { ProductsHero } from "./comp/ProductsHero";
import { ProductsSection } from "./comp/ProductsSection";

export default function ProductsPage() {
    return (
        <MainLayoutContainer header={<MainAppBar showSignup={false} showLogin={false} showNavItems={false} />}>
            <ProductsHero />
            <ProductsSection />
        </MainLayoutContainer>
    );
}
