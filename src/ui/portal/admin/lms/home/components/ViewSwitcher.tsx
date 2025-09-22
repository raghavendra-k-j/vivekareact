import { PopoverSelect } from "~/ui/widgets/form/PopoverSelect";
import { useNavigate } from "react-router";
import { hasLMSBothPermissions } from "../../utils/lmsUtils";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { useIsLinkActive } from "~/ui/hooks/useIsLinkActive";
import { useCallback } from "react";
import { useLMSHomePageStore } from "../LMSHomePageContext";
import { useLMSStore } from "../../layout/LMSLayoutContext";

export class LMSView {
    public readonly id: string;
    public readonly label: string;
    public readonly path: string;

    constructor({ id, label, path }: { id: string; label: string; path: string }) {
        this.id = id;
        this.label = label;
        this.path = path;
    }
}

export function LMSViewSwitcher() {
    const appStore = useAppStore();
    const navigate = useNavigate();
    const lmsLayoutStore = useLMSStore();

    const allCoursesView = new LMSView({ id: "all-courses", label: `All ${lmsLayoutStore.courseLabelPlural}`, path: "/console/lms/spaces" });
    const myCoursesView = new LMSView({ id: "my-courses", label: `My ${lmsLayoutStore.courseLabelPlural}`, path: "/console/lms/my-courses" });

    const getCurrentView = useCallback((): LMSView => {
        for (const view of [allCoursesView, myCoursesView]) {
            if (useIsLinkActive(view.path)) {
                return view;
            }
        }
        return allCoursesView;
    }, [allCoursesView, myCoursesView]);


    if (!hasLMSBothPermissions({ appStore: appStore })) {
        return null;
    }

    const handleViewChange = (view: LMSView | null) => {
        if (view) {
            navigate(view.path);
        }
    };

    return (
        <div className="flex items-center">
            <PopoverSelect
                items={[allCoursesView, myCoursesView]}
                value={getCurrentView()}
                onValueChange={handleViewChange}
                itemRenderer={(item: LMSView) => item.label}
                itemKey={(item: LMSView) => item.id}
                placeholder="Select View"
                allowEmpty={false}
                className="min-w-[160px]"
                hidePlaceholder={true}
            />
        </div>
    );
}