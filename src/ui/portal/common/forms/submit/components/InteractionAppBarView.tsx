import { ArrowLeft } from "lucide-react";
import { EasyBrandAppBar } from "~/ui/portal/components/appbar/EasyBrandAppBar";
import { AppBarUserAvatar } from "~/ui/portal/components/avatar/AppBarUserAvatar";
import { useInteractionStore } from "../interaction/InteractionContext";
import { TimerView } from "../interaction/comp/TimerView";


export function InteractionAppBarView() {
    return (<EasyBrandAppBar
        leading={<AppBarLeading />}
        trailing={<AppBarTrailing />}
    />);
}



function AppBarLeading() {
    const store = useInteractionStore();
    const handleOnBack = () => {
        store.onExitForm();
    };

    return (
        <div className="flex items-center gap-4 min-w-0">
            <button onClick={handleOnBack}>
                <ArrowLeft size={24} />
            </button>
            <span className="text-base font-semibold truncate">
                {store.formDetail.title}
            </span>
        </div>
    );
}


function AppBarTrailing() {
    const store = useInteractionStore();
    return (
        <div className="flex items-center gap-3">
            {store.vmState.isData && store.hasTimeLimit && <TimerView />}
            <AppBarUserAvatar />
        </div>
    );
}