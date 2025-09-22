import { Observer } from "mobx-react-lite";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { PopoverSelect } from "~/ui/widgets/form/PopoverSelect";
import { LMSPageHeader, LMSPageHeaderSearch } from "../../components/LMSPageHeader";
import { useAdminMyCoursesStore } from "../MyCoursesContext";

export function AppBarView() {
    const store = useAdminMyCoursesStore();

    const statusOptions = [
        { label: "All Status", value: null },
        { label: CourseStatus.DRAFT.label, value: CourseStatus.DRAFT },
        { label: CourseStatus.ACTIVE.label, value: CourseStatus.ACTIVE },
        { label: CourseStatus.COMPLETED.label, value: CourseStatus.COMPLETED }
    ];

    return (
        <Observer>
            {() => (
                <LMSPageHeader
                    title="My Courses"
                    search={
                        <LMSPageHeaderSearch
                            placeholder="Search courses..."
                            value={store.searchQuery}
                            onChange={(value) => store.setSearchQuery(value)}
                        />
                    }
                    filters={
                        <PopoverSelect
                            items={statusOptions}
                            value={statusOptions.find(option => option.value === store.selectedStatus) || statusOptions[0]}
                            onValueChange={(option) => {
                                if (option) {
                                    store.setSelectedStatus(option.value);
                                }
                            }}
                            itemRenderer={(item) => item.label}
                            itemKey={(item) => item.label}
                            placeholder="Select Status"
                            allowEmpty={false}
                            hidePlaceholder={true}
                        />
                    }
                />
            )}
        </Observer>
    );
}