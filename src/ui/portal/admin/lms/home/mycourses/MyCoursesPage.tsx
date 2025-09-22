import { useRef } from "react";
import { AdminMyCoursesStore } from "./MyCoursesStore";
import { AdminMyCoursesContext, useAdminMyCoursesStore } from "./MyCoursesContext";
import { useLMSStore } from "../../layout/LMSLayoutContext";
import { AdminPageAppBar, AdminPageAppBarTitle } from "../../../components/PageAppBar";
import { Input } from "~/ui/widgets/form/Input";


function PageInner() {
    const store = useAdminMyCoursesStore();
    return (<div>
        <AdminPageAppBar
            start={<AdminPageAppBarTitle title="My Courses" />}
            end={<AppBarEnd />}
        />
    </div>);
}

function AppBarEnd() {
    return (<div>
        <Input
            placeholder="Search courses..."
        />
    </div>);
}





function PageProvider({ children, store }: { children: React.ReactNode, store: AdminMyCoursesStore }) {
    return (<AdminMyCoursesContext.Provider
        value={store}>
        {children}
    </AdminMyCoursesContext.Provider>);
}



export default function MyCoursesPage() {
    const storeRef = useRef<AdminMyCoursesStore | null>(null);
    const lmsStore = useLMSStore();
    if (!storeRef.current) {
        storeRef.current = new AdminMyCoursesStore({
            lmsStore: lmsStore
        });
    }
    return (<PageProvider store={storeRef.current}>
        <PageInner />
    </PageProvider>);
}