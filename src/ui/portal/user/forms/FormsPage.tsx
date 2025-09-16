import { HomeLayoutData } from "~/domain/common/models/HomeLayout";
import { HomePageWrapper } from "../home/components/HomePageContent";
import { useHomeLayoutStore } from "../home/HomeLayoutContext";

export default function FormsPage() {
    return (<HomePageWrapper id={HomeLayoutData.ID_ASSESSMENTS}>
        <PageInner />
    </HomePageWrapper>);
}

function PageInner() {
    const homeStore = useHomeLayoutStore();
    return (<div>{homeStore.homeLayout.navigation.items.length}</div>);
}