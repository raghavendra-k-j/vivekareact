import { Observer } from "mobx-react-lite";
import { useAdminFormCompareStore } from "../ComparePageContext";
import OutlinedButton from "~/ui/widgets/button/OutlinedButton";
import { CompareHeader } from "./CompareHeader";
import { useEffect } from "react";
import { CompareOverviewSection } from "./OverviewSection";
import { UserListSection } from "./UserListSection";
import { ArrowLeft } from "lucide-react";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";


export function CompareResultTab() {
    const store = useAdminFormCompareStore();

    useEffect(() => {
        store.fetchComparisonOverview();
    });

    return (<div className="flex flex-col overflow-y-auto h-full">
        <Header />
        <Observer>
            {() => {
                return store._compareVm!.overViewState.stateWhen({
                    initOrLoading: () => (<Centered><LoaderView /></Centered>),
                    error: (error) => (<Centered><SimpleRetryableAppView appError={error} onRetry={() => store.fetchComparisonOverview()} /></Centered>),
                    loaded: () => (<MainContentView />),
                });
            }}
        </Observer>
    </div>);
}


function Centered({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col flex-1 h-full justify-center items-center p-6">{children}</div>;
}

function MainContentView() {
    const store = useAdminFormCompareStore();
    return (<div className="p-6 flex flex-col space-y-4">
        <Observer>
            {() => store.compareVm.overViewState.isData ? <CompareHeader /> : null}
        </Observer>
        <Observer>
            {() => store.compareVm.overViewState.isData ? <CompareOverviewSection /> : null}
        </Observer>
        <Observer>
            {() => store.compareVm.overViewState.isData ? <UserListSection /> : null}
        </Observer>
    </div>);
}


export function Header() {
    const store = useAdminFormCompareStore();

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-surface shadow-xs border-b border-strong">
            <div className="flex items-center space-x-4">
                <OutlinedButton
                    size="sm"
                    onClick={() => store.resetComparison()}
                    className="flex items-center space-x-1"
                >
                    <ArrowLeft className="w-4 h-4" />
                </OutlinedButton>
                <div>
                    <h1 className="text-base font-semibold text-default">Assessment Comparison Results</h1>
                </div>
            </div>
        </header>
    );
}