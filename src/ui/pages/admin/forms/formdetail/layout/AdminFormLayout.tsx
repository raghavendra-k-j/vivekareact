import React, { useRef } from "react";
import { Outlet, useParams } from "react-router";
import { AdminFormProvider } from "./AdminFormProvider";
import { AdminFormStore } from "./AdminFormStore";
import { Observer } from "mobx-react-lite";
import { useAdminFormStore } from "./AdminFormContext";
import { PageLoader } from "~/ui/components/loaders/PageLoader";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";

const AdminFormLayout: React.FC = () => {
    return (
        <AdminFormLayoutInner />
    );
};

const AdminFormLayoutInner: React.FC = () => {
    const { permalink } = useParams<{ permalink: string }>();
    const store = useRef<AdminFormStore | null>(null);

    if (store.current === null) {
        store.current = new AdminFormStore({
            permalink: permalink || "",
        });
    }

    return (
        <AdminFormProvider store={store.current}>
            <Body />
        </AdminFormProvider>
    );
};

export default AdminFormLayout;


export function Body() {
    const store = useAdminFormStore();

    return (
        <Observer>
            {() => {
                return store.fdState.stateWhen({
                    initOrLoading: () => (<Center><PageLoader /></Center>),
                    error: (error) => (<Center><SimpleRetryableAppView appError={error} onRetry={() => store.loadFormDetails()} /></Center>),
                    loaded: () => (<Main />),
                });
            }}
        </Observer>
    );
}


function Center({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            {children}
        </div>
    );
}



function Main() {
    return (<Outlet />);
}