import { observer } from "mobx-react-lite";
import { useQPGenPageStore } from "./QPGenPageContext";
import { QPGenPageProvider } from "./QPGenPageProvider";
import { InitCard } from "./comp/InitCard";
import { QPGenInputFormView } from "./comp/InputView";
import { LoadingCard } from "./comp/LoadingView";
import { ErrorCard } from "./comp/OutputErrorView";
import { QPGenOutputDataView } from "./comp/OutputView";


export default function QPGenPage() {
    return (
        <QPGenPageProvider>
            <div className="flex flex-col shrink-0 h-screen min-h-screen overflow-hidden text-default">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded mb-2">
                    <span className="inline-block bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">Alpha</span>
                    <span>This is an experimental feature and is under development.</span>
                </div>
                <main className="flex-1 flex flex-row shrink-0 gap-6 w-full h-full p-6 overflow-y-auto">
                    <QPGenInputFormView />
                    <QPGenOutputView />
                </main>
            </div>
        </QPGenPageProvider>
    );
}


const QPGenOutputView = observer(function QPGenOutputView() {
    const store = useQPGenPageStore();
    return (
        <div className="flex-1">
            {store.qpGenState.isError && <ErrorCard error={store.qpGenState.error} />}
            {store.qpGenState.isLoading && <LoadingCard />}
            {store.qpGenState.isInit && <InitCard />}
            {!store.qpGenState.isError && !store.qpGenState.isLoading && !store.qpGenState.isInit && <QPGenOutputDataView />}
        </div>
    );
});




