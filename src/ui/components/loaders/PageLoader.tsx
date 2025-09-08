import clsx from "clsx";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";

export function PageLoader({className}: { className?: string }) {
    return (
        <div className={clsx("flex justify-center items-center w-screen h-screen", className)}>
            <LoaderView />
        </div>
    );
}

export function PageLoaderShimmer() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
}