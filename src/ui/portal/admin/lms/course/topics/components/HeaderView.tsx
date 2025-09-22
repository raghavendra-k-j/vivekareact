import { Observer } from "mobx-react-lite";
import { Button } from "~/ui/widgets/button/Button";
import { Input } from "~/ui/widgets/form/Input";
import { useTopicsStore } from "../TopicsContext";

export function HeaderView() {
    const store = useTopicsStore();
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
                                        placeholder="Search topics by name..."
                                        type="search"
                                        className="font-medium w-full max-w-md"
                                        value={store.searchQuery}
                                        onChange={(e) => {
                                            store.updateSearchQuery(e.target.value);
                                            store.loadTopics({ page: 1 });
                                        }}
                                    />
                                )}
                            </Observer>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                color="primary"
                                variant="solid"
                                size="md"
                                onClick={() => store.topicDialogStore.openCreateDialog()}
                            >
                                New Topic
                            </Button>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
}