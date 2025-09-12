import { Observer } from "mobx-react-lite";
import { usePlansPageStore } from "../PlansPageContext";
import clsx from "clsx";

export function IntervalSelector() {
    const store = usePlansPageStore();
    return (
        <div className="flex items-center justify-center mb-4">
            <div className="bg-surface border border-default shadow-sm rounded-lg p-1">
                <Observer>
                    {() => (
                        <>
                            {store.billingIntervalPlans.map((group) => (
                                <TabItem
                                    key={group.billingInterval.value}
                                    label={group.billingInterval.label}
                                    selected={store.selectedInterval?.billingInterval === group.billingInterval}
                                    onClick={() => store.onBillingIntervalChange(group.billingInterval.value)}
                                />
                            ))}
                        </>
                    )}
                </Observer>
            </div>
        </div>
    );
}


type TabItemProps = {
    label: string;
    selected: boolean;
    onClick: () => void;
}

function TabItem(props: TabItemProps) {
    return (
        <button
            onClick={props.onClick}
            className={clsx(
                "relative px-4 py-2 text-sm font-medium rounded-md transition-all",
                props.selected
                    ? "bg-primary text-white shadow-sm"
                    : "text-default hover:text-strong"
            )}
        >
            {props.label}
        </button>
    );
}