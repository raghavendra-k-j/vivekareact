import { useHomeLayoutStore } from "../HomeLayoutContext";
import { FeatureNotEnabledView } from "./FeatureNotEnabledView";

export function HomePageWrapper({ children, id }: { children: React.ReactNode, id: string }) {
    const homeStore = useHomeLayoutStore();
    if (!homeStore.layoutDataState.isData) {
        return null;
    }
    if (!homeStore.homeLayout.hasEnabledNavItem(id)) {
        return <FeatureNotEnabledView />;
    }
    return (<>{children}</>);
}