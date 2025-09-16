import { AdminPageAppBar, AdminPageAppBarTitle } from "../../../components/PageAppBar";

export function HomeAppBar() {
    return <AdminPageAppBar
        start={<AdminPageAppBarTitle title="Learning Management System" />}
    />;
}