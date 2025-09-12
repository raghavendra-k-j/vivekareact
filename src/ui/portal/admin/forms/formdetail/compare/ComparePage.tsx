import { useEffect } from "react";
import { PageLoader } from "~/ui/components/loaders/PageLoader";
import { useAdminFormCompareStore } from "./ComparePageContext";
import { AdminFormCompareStoreProvider } from "./ComparePageProvider";
import { Observer } from "mobx-react-lite";
import { AppError } from "~/core/error/AppError";
import { SimpleErrorView } from "~/ui/widgets/error/SimpleErrorView";
import FilledButton from "~/ui/widgets/button/FilledButton";
import { FormCompareConst } from "~/domain/forms/admin/models/compare/FormCompareConst";
import { CompareCurrentPageState } from "./models/CompareTabFragment";
import { UnknowStateView } from "~/ui/components/errors/UnknowStateView";
import SelectFormTab from "./comp/SelectFormTab";
import { CompareResultTab } from "./comp/CompareResultTab";

export default function AdminFormComparePage() {
    return (<AdminFormCompareStoreProvider>
        <CompareInner />
    </AdminFormCompareStoreProvider>);
}

function Centered({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col h-screen w-screen justify-center items-center">{children}</div>;
}

function CompareInner() {
    const store = useAdminFormCompareStore();
    useEffect(() => {
        store.fetchMetadata();
        return () => {
            return store.dispose();
        }
    }, [store]);

    return (
        <Observer>
            {() => {
                return store.metadataState.stateWhen({
                    initOrLoading: () => <Centered><PageLoader /></Centered>,
                    error: (error) => (<PageContent><ErrorView error={error} /></PageContent>),
                    loaded: () => (<PageContent><MainContentView /></PageContent>)
                });
            }}
        </Observer>
    );
}


function PageContent({ children }: { children: React.ReactNode }) {
    return (<div className="h-full overflow-y-auto">{children}</div>);
}

function ErrorView({ error }: { error: AppError }) {
    const store = useAdminFormCompareStore();
    return (
        <Centered>
            <SimpleErrorView
                className="p-6"
                message={error.message}
                description={error.description}
                actions={
                    error.errorCode !== FormCompareConst.ERROR_COMPARE_COMMONS_FORM_NOT_ELIGIBLE
                        ? [
                            <FilledButton key="retry" onClick={() => store.fetchMetadata()}>Retry</FilledButton>
                        ]
                        : undefined
                }
            />
        </Centered>
    );
}


function MainContentView() {
    const store = useAdminFormCompareStore();
    return (<Observer>
        {() => {
            if (store.currentPageState === CompareCurrentPageState.RESULT_PAGE) {
                return (<CompareResultTab />);
            }
            if (store.currentPageState === CompareCurrentPageState.SELECT_FORM) {
                return (<SelectFormTab />);
            }
            return (<UnknowStateView />);
        }}
    </Observer>);
}