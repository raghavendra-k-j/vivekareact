import { Observer } from "mobx-react-lite";
import { useAdminFormCompareStore } from "../ComparePageContext";
import { CompareSectionCard, CompareSectionCardTitle } from "./SectionCard";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { ComparisonOverviewTable } from "./OverviewTable";
import { CompareOverviewCharts } from "./OverviewChart";
import * as Tabs from "@radix-ui/react-tabs";
import { AppError } from "~/core/error/AppError";

const Centered = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center min-h-[200px]">
        {children}
    </div>
);

const LoadingView = () => (
    <CompareSectionCard>
        <Centered>
            <LoaderView />
        </Centered>
    </CompareSectionCard>
);

const ErrorView = (props: { error: AppError; onRetry: () => void }) => (
    <CompareSectionCard>
        <Centered>
            <SimpleRetryableAppView appError={props.error} onRetry={props.onRetry} />
        </Centered>
    </CompareSectionCard>
);


// TODO: Use a proper design token for styling
const TabItem = ({ children, value }: { children: React.ReactNode; value: string }) => (
    <Tabs.Trigger
        value={value}
        className={`
      px-3 py-1 text-sm font-medium transition-colors
      border rounded-[var(--dimen-button-radius)]
      

      data-[state=active]:border-primary
      data-[state=active]:text-primary
      data-[state=active]:bg-primary-100/50
      data-[state=inactive]:border-slate-300

      focus:outline-none
    `}
    >
        {children}
    </Tabs.Trigger>
);

export function CompareOverviewSection() {
    const store = useAdminFormCompareStore();
    const overviewState = store.compareVm.overViewState;
    return (
        <Observer>
            {() =>
                overviewState.stateWhen({
                    initOrLoading: () => <LoadingView />,
                    error: (error) => <ErrorView error={error} onRetry={() => store.fetchComparisonOverview()} />,
                    loaded: () => {
                        const overview = overviewState.data!;
                        return (
                            <CompareSectionCard>
                                <Tabs.Root defaultValue="chart">
                                    <div className="flex justify-between items-center px-3 py-2 bg-section-header">
                                        <CompareSectionCardTitle className="mr-2">
                                            Overall Comparison Summary
                                        </CompareSectionCardTitle>
                                        <Tabs.List className="flex space-x-1">
                                            <TabItem value="chart">Charts</TabItem>
                                            <TabItem value="table">Table</TabItem>
                                        </Tabs.List>
                                    </div>
                                    <Tabs.Content value="chart">
                                        <CompareOverviewCharts overview={overview} />
                                    </Tabs.Content>
                                    <Tabs.Content value="table">
                                        <ComparisonOverviewTable overview={overview} />
                                    </Tabs.Content>
                                </Tabs.Root>
                            </CompareSectionCard>
                        );
                    },
                })
            }
        </Observer>
    );
}
