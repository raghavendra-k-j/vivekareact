import { Observer } from "mobx-react-lite";
import { FormCard } from "~/ui/portal/common/forms/components/FormCard";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { FormItemVm } from "../../shared/models/FormsListVm";
import { CourseContentsStore } from "../CourseContentsStore";
import { useCourseContentsStore } from "../CourseDetailContext";
import clsx from "clsx";

export function ContentsListView({ className }: { className?: string }) {
    return (<div className={clsx("flex flex-col flex-1 h-full min-h-0", className)}>
        <h1>Contents</h1>
        <ListContainerView />
    </div>);
}

function ListContainerView() {
    const store = useCourseContentsStore();
    return (<div>
        <Observer>
            {() => {
                if (store.queryState.isData) {
                    return <ListView />;
                }
                else if (store.queryState.isError) {
                    return (<SimpleRetryableAppView
                        appError={store.queryState.error!}
                        onRetry={() => store.loadContents({ page: store.currentPage })}
                    />);
                }
                return (<ListShimmer />);
            }}
        </Observer>
    </div>);
}

function ListView() {
    const store = useCourseContentsStore();
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {store.items.map(item => (<ListItem key={item.base.id} store={store} item={item} />))}
    </div>);
}


function ListShimmer() {
    const totalShimmerItems = 10;
    return (<div>
        {Array.from({ length: totalShimmerItems }).map((_, index) => (<ListItemShimmer key={index} />))}
    </div>);
}

function ListItem({ store, item }: { store: CourseContentsStore, item: FormItemVm }) {
    return (<FormCard form={item} />);
}

function ListItemShimmer() {
    return (<div className="bg-surface shadow-sm rounded p-4 mb-2 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>);
}
