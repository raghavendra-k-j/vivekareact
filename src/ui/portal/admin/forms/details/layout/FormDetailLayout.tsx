import { useEffect, useRef } from "react";
import { AdminFormDetailStore } from "./FormDetailStore";
import { useAdminFormsModuleStore } from "../../layout/FormsLayoutContext";
import { AdminFormDetailContext, useAdminFormDetailStore } from "./FormDetailContext";
import { Outlet, useParams } from "react-router";
import { Observer } from "mobx-react-lite";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { AdminFormDetailHeaderView } from "./components/HeaderView";

function LayoutProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AdminFormDetailStore | null>(null);
    const moduleStore = useAdminFormsModuleStore();
    const params = useParams<string>();
    const permalink: string = params.permalink!;

    if (!storeRef.current || storeRef.current.permalink !== permalink) {
        storeRef.current = new AdminFormDetailStore({
            layoutStore: moduleStore,
            permalink: permalink
        });
    }
    return (
        <AdminFormDetailContext.Provider value={storeRef.current}>
            {children}
        </AdminFormDetailContext.Provider>
    );
}


const LoadShimmer = () => {
    return (<FullCenteredView>
        <LoaderView />
    </FullCenteredView>);
}

const ErrorView = () => {
    const store = useAdminFormDetailStore();
    return (<FullCenteredView>
        <SimpleRetryableAppView
            appError={store.vmState.error}
            onRetry={() => store.loadFormDetails()}
        />
    </FullCenteredView>);
};

const InnerView = () => {
    const store = useAdminFormDetailStore();

    useEffect(() => {
        if (store.vmState.isInit) {
            store.loadFormDetails();
        }
    }, [store]);

    return (<Observer>
        {() => {
            if (store.vmState.isData) {
                return (<>
                    <AdminFormDetailHeaderView />
                    <Outlet />
                </>);
            }
            if (store.vmState.isError) {
                return (<ErrorView />);
            }
            return (<LoadShimmer />);
        }}
    </Observer>);
}


export default function AdminFormDetailLayout() {
    return (
        <LayoutProvider>
            <InnerView />
        </LayoutProvider>
    );
}