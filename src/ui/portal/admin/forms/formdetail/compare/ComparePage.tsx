import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import { AppError } from "~/core/error/AppError";
import { FormCompareConst } from "~/domain/forms/admin/models/compare/FormCompareConst";
import { UnknowStateView } from "~/ui/components/errors/UnknowStateView";
import { PageLoader } from "~/ui/components/loaders/PageLoader";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleErrorView } from "~/ui/widgets/error/SimpleErrorView";
import { CompareResultTab } from "./comp/CompareResultTab";
import SelectFormTab from "./comp/SelectFormTab";
import { useAdminFormCompareStore } from "./ComparePageContext";
import { AdminFormCompareStoreProvider } from "./ComparePageProvider";
import { CompareCurrentPageState } from "./models/CompareTabFragment";

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
                            <Button key="retry" onClick={() => store.fetchMetadata()}>Retry</Button>
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