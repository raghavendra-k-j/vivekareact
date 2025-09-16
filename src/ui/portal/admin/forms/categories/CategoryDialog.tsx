import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { DialogFooter } from "~/ui/components/dialog";
import { DialogCloseButton, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogScaffold
} from "~/ui/widgets/dialogmanager";
import { makeObservable, observable, action } from "mobx";

class CategoryDialogStore {
    name: string = "";
    isLoading: boolean = false;

    constructor() {
        makeObservable(this, {
            name: observable,
            isLoading: observable,
            setName: action.bound,
            setLoading: action.bound,
        });
    }

    setName(name: string) {
        this.name = name;
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    reset() {
        this.name = "";
        this.isLoading = false;
    }
}

interface CategoryDialogProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialName?: string;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
}

function CategoryDialogInner({ isOpen, mode, initialName, onClose, onSubmit }: CategoryDialogProps) {
    const storeRef = useRef<CategoryDialogStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new CategoryDialogStore();
    }
    const store = storeRef.current;

    // Reset when dialog opens
    if (isOpen && store.name === "" && initialName) {
        store.setName(initialName);
    } else if (!isOpen) {
        store.reset();
    }

    const handleSubmit = async () => {
        if (!store.name.trim()) return;
        store.setLoading(true);
        try {
            await onSubmit(store.name.trim());
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            store.setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog onClose={onClose}>
            <DialogOverlay />
            <DialogScaffold>
                <DialogContent className="w-full max-w-md">
                    <DialogHeader
                        className="border-"
                        onClose={<DialogCloseButton onClick={onClose} />}
                        title={mode === 'create' ? 'Create Category' : 'Edit Category'}
                    />
                    <div className="space-y-4 p-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter category name"
                                value={store.name}
                                onChange={(e) => store.setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Observer>
                            {() => (
                                <Button
                                    onClick={handleSubmit}
                                    loading={store.isLoading}
                                    disabled={!store.name.trim()}
                                >
                                    {mode === 'create' ? 'Create' : 'Update'}
                                </Button>
                            )}
                        </Observer>
                    </DialogFooter>
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}

export { CategoryDialogInner as CategoryDialog };