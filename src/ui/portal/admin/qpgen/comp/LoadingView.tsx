import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { CommonCenterCard } from "./CommonCard";

export function LoadingCard() {
    return (
        <CommonCenterCard>
            <div className="flex flex-col gap-4 items-center justify-center">
                <LoaderView />
                <div>Generating Question Paper...</div>
            </div>
        </CommonCenterCard>
    );
}
