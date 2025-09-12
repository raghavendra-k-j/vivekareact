import { Observer } from "mobx-react-lite";
import React, { useRef } from "react";
import { Outlet, useParams } from "react-router";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { useAdminFormStore } from "./AdminFormContext";
import { AdminFormProvider } from "./AdminFormProvider";
import { AdminFormStore } from "./AdminFormStore";

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
                    initOrLoading: () => (<Center><LoaderView /></Center>),
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