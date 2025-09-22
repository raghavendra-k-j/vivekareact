import { Observer } from "mobx-react-lite";
import { DialogCloseButton, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import { Input } from "~/ui/widgets/form/Input";
import { Dialog, DialogContent, DialogOverlay, DialogScaffold } from "~/ui/widgets/dialogmanager";
import { TopicDialogProvider, useTopicDialogStore } from "../TopicDialogContext";
import { TopicDialogStore } from "../TopicDialogStore";
import { AvatarColorPicker } from "~/ui/components/avatarcolorpicker";

function DialogHeaderView() {
    const store = useTopicDialogStore();
    return (
        <div className="border-b border-default">
            <DialogHeader
                title={store.isEdit ? "Edit Topic" : "Create New Topic"}
                onClose={<DialogCloseButton onClick={() => store.closeDialog()} />}
            />
        </div>
    );
}

function DialogContentView() {
    const store = useTopicDialogStore();

    return (
        <div className="p-6 space-y-4">
            <Observer>
                {() => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Topic Name
                        </label>
                        <Input
                            value={store.topicName}
                            onChange={(e) => store.setTopicName(e.target.value)}
                            placeholder="Enter topic name"
                        />
                    </div>
                )}
            </Observer>

            <Observer>
                {() => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Avatar Color
                        </label>
                        <AvatarColorPicker
                            value={store.selectedAvatarColor}
                            onChange={(color) => store.setSelectedAvatarColor(color)}
                        />
                    </div>
                )}
            </Observer>
        </div>
    );
}

function DialogFooterView() {
    const store = useTopicDialogStore();

    return (
        <div className="flex justify-end gap-2 p-4 border-t border-default">
            <Button
                variant="outline"
                onClick={() => store.closeDialog()}
            >
                Cancel
            </Button>
            <Observer>
                {() => (
                    <Button
                        color="primary"
                        onClick={() => store.submit()}
                        disabled={!store.topicName.trim() || !store.selectedAvatarColor}
                    >
                        {store.isEdit ? "Update" : "Create"}
                    </Button>
                )}
            </Observer>
        </div>
    );
}

function DialogInner() {
    return (
        <Dialog onClose={() => { }}>
            <DialogOverlay />
            <DialogScaffold className="p-0">
                <DialogContent className="w-full max-w-md flex flex-col">
                    <DialogHeaderView />
                    <DialogContentView />
                    <DialogFooterView />
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}

export type TopicDialogProps = {
    dialogStore: TopicDialogStore;
}

export default function TopicDialog(props: TopicDialogProps) {
    return (
        <TopicDialogProvider store={props.dialogStore}>
            <DialogInner />
        </TopicDialogProvider>
    );
}