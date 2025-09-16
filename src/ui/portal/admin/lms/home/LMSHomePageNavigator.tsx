import { Navigate } from "react-router";
import { useLMSStore } from "../layout/LMSLayoutContext";

export default function AdminLMSHomePageNavigator() {
    const lmsStore = useLMSStore();
    if (lmsStore.hasAllPermission) {
        return (<Navigate to="/console/lms/spaces" replace={true} />);
    }
    else if (lmsStore.hasAssignedPermission) {
        return (<Navigate to="/console/lms/my-courses" replace={true} />);
    }
    else {
        return null;
    }
}