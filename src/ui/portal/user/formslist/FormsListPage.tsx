import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { FormType } from "~/domain/forms/models/FormType";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { useHomePageStore } from "../home/HomePageContext";
import { FormsListContext, useFormsListStore } from "./FormsListContext";
import { FormsListStore } from "./FormsListStore";
import { FormGrid, FormGridSkeleton } from "./components/FormGrid";
import { HeaderView } from "./components/HeaderView";

function FormsListPageProvider({ children, formType }: { children: React.ReactNode, formType: FormType }) {
    const homeStore = useHomePageStore();
    const storeRef = useRef<FormsListStore | null>(null);
    if (storeRef.current === null || storeRef.current.formType !== formType) {
        storeRef.current = new FormsListStore({
            homeStore: homeStore,
            formType: formType
        });
    }
    return (
        <FormsListContext.Provider value={storeRef.current}>
            {children}
        </FormsListContext.Provider>
    );
}

function FormsListInner() {
    const store = useFormsListStore();

    useEffect(() => {
        if (store.loadState.isInit) {
            store.loadForms();
        }
    }, [store]);

    return (
        <div className="h-full min-h-0 flex flex-col flex-1 overflow-y-auto py-4 sm:py-6">
            <HeaderView />
            <Observer>
                {() => {
                    if (store.loadState.isData) {
                        return (<FormGrid />);
                    }
                    if (store.loadState.isError) {
                        return (<FullCenteredView>
                            <SimpleRetryableAppView
                                className="p-4 sm:p-6"
                                appError={store.loadState.error}
                                onRetry={() => store.loadForms({ page: store.loadedCurrentPage })}
                            />
                        </FullCenteredView>);
                    }
                    return <FormGridSkeleton />;
                }}
            </Observer>
        </div>
    );
}

export default function FormsListPage({ formType }: { formType: FormType }) {
    return (
        <FormsListPageProvider formType={formType}>
            <FormsListInner />
        </FormsListPageProvider>
    );
}