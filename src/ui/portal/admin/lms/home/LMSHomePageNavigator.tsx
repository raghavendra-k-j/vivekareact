import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { useLMSStore } from "../layout/LMSLayoutContext";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { useEffect } from "react";
import { navigateToLMSAdminHome } from "../utils/lmsUtils";

export default function AdminLMSHomePageNavigator() {
    const lmsStore = useLMSStore();
    useEffect(() => {
        navigateToLMSAdminHome({ appStore: lmsStore.appStore });
    },
    [lmsStore]);

    return (<FullCenteredView>
        <LoaderView />
    </FullCenteredView>);
}