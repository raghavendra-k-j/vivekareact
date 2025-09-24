import React from "react";
import { DialogCloseButton, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import { Input } from "~/ui/widgets/form/Input";
import { Dialog, DialogContent, DialogOverlay, DialogScaffold } from "~/ui/widgets/dialogmanager";
import { TopicsStore } from "../TopicsStore";
import { AdminTopicItem } from "~/domain/lms/models/AdminTopicItem";

export interface UpsertTopicDialogProps {
    mode: "create" | "edit";
    topic?: AdminTopicItem;
    topicsStore: TopicsStore;
    onClose: () => void;
}

export function UpsertTopicDialog({ mode, topic, topicsStore, onClose }: UpsertTopicDialogProps) {
    const isEdit = mode === "edit";
    const initialName = isEdit && topic ? topic.name : "";

    return <UpsertTopicDialogInner
        isEdit={isEdit}
        initialName={initialName}
        topic={topic}
        topicsStore={topicsStore}
        onClose={onClose}
    />;
}

function UpsertTopicDialogInner({
    isEdit,
    initialName,
    topic,
    topicsStore,
    onClose
}: {
    isEdit: boolean;
    initialName: string;
    topic?: AdminTopicItem;
    topicsStore: TopicsStore;
    onClose: () => void;
}) {
    const [topicName, setTopicName] = React.useState(initialName);

    const handleSubmit = async () => {
        if (!topicName.trim()) {
            return;
        }

        try {
            if (isEdit && topic) {
                await topicsStore.updateTopic(topic.id, topicName.trim());
            } else {
                await topicsStore.createTopic(topicName.trim());
            }
            onClose();
        } catch (error) {
            // Error handling is done in the store methods
        }
    };

    return (
        <Dialog onClose={onClose}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-none"
                        title={isEdit ? "Edit Topic" : "Create New Topic"}
                        onClose={<DialogCloseButton onClick={onClose} />}
                    />
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topic Name
                            </label>
                            <Input
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                                placeholder="Enter topic name"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t border-default">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!topicName.trim()}
                        >
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </div>
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}