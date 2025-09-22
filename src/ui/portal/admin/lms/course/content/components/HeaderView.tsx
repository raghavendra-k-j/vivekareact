import { Observer } from "mobx-react-lite";
import { FormType } from "~/domain/forms/models/FormType";
import { Button } from "~/ui/widgets/button/Button";
import { Input } from "~/ui/widgets/form/Input";
import { PopoverSelect } from "~/ui/widgets/form/PopoverSelect";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { useContentStore } from "../ContentContext";

export function HeaderView() {
    const store = useContentStore();
    return (
        <Observer>
            {() => {
                return (
                    <div className="flex items-center justify-between gap-3 p-4 border-b border-default">
                        <div className="flex items-center gap-3 flex-1">
                            <Observer>
                                {() => (
                                    <Input
                                        inputSize="md"
                                        placeholder="Search content by title..."
                                        type="search"
                                        className="font-medium w-full max-w-md"
                                        value={store.searchQuery}
                                        onChange={(e) => {
                                            store.updateSearchQuery(e.target.value);
                                            store.loadContents({ page: 1 });
                                        }}
                                    />
                                )}
                            </Observer>
                            <Observer>
                                {() => (
                                    <PopoverSelect<FormType>
                                        items={[FormType.Assessment, FormType.Survey]}
                                        value={store.selectedFormType}
                                        onValueChange={(type) => {
                                            store.selectedFormType = type;
                                            store.loadContents({ page: 1 });
                                        }}
                                        itemRenderer={(item: FormType) => item.name}
                                        itemKey={(item: FormType) => item.type}
                                        placeholder="All Types"
                                        allowEmpty={true}
                                        className="w-36 shrink-0"
                                    />
                                )}
                            </Observer>
                            <Observer>
                                {() => (
                                    <PopoverSelect<AdminFormStatus>
                                        items={AdminFormStatus.values}
                                        value={store.selectedAdminFormStatus}
                                        onValueChange={(status) => {
                                            store.selectedAdminFormStatus = status;
                                            store.loadContents({ page: 1 });
                                        }}
                                        itemRenderer={(item: AdminFormStatus) => item.name}
                                        itemKey={(item: AdminFormStatus) => item.status}
                                        placeholder="All Statuses"
                                        allowEmpty={true}
                                        className="w-36 shrink-0"
                                    />
                                )}
                            </Observer>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                color="success"
                                variant="solid"
                                size="md"
                                onClick={() => store.newForm({ type: FormType.Assessment })}
                            >
                                New Assessment
                            </Button>
                            <Button
                                color="primary"
                                variant="solid"
                                size="md"
                                onClick={() => store.newForm({ type: FormType.Survey })}
                            >
                                New Survey
                            </Button>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
}