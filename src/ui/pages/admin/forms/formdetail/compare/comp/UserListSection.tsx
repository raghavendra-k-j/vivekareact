import { useEffect } from "react";
import { CompareSectionCard, CompareSectionCardTitle } from "./SectionCard";
import { UsersListTable } from "./UsersListTable";
import { useAdminFormCompareStore } from "../ComparePageContext";
import { Observer } from "mobx-react-lite";
import { SearchInput } from "~/ui/widgets/search/SearchInput";

export function UserListSection() {
    const store = useAdminFormCompareStore();

    useEffect(() => {
        store.fetchComparisonUsers({ page: 1 });
    }, [store]);

    return (
        <CompareSectionCard>
            <SectionHeader />
            <UsersListTable />
        </CompareSectionCard>
    );
};

function SectionHeader() {
    const store = useAdminFormCompareStore();
    return (
        <div className="flex flex-row justify-between items-center gap-3 px-3 py-2">
            <CompareSectionCardTitle>User-wise Metrics</CompareSectionCardTitle>
            <div>
                <Observer>
                    {() => (
                        <SearchInput
                            inputSize="sm"
                            placeholder="Search users by name, email or mobile number"
                            onChange={e => store.compareVm.onSearchQueryChange(e.target.value)}
                            containerClassName="min-w-[400px] max-w-[400px]"
                        />
                    )}
                </Observer>
            </div>
        </div>
    );
};