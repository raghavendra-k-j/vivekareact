import { makeObservable, observable, action, computed } from "mobx";

export class EasySelectStore<T = any> {
    searchText = "";
    selectedIds = new Set<string>();
    isOpen = false;
    items: T[] = [];
    searchPlaceholder?: string;
    maxHeight?: string;
    
    getItemId: (item: T) => string = () => "";
    getItemLabel: (item: T) => React.ReactNode = () => "";
    isMultiSelect = false;
    onResult?: (selectedItems: T[]) => void;

    constructor() {
        makeObservable(this, {
            searchText: observable,
            selectedIds: observable,
            isOpen: observable,
            items: observable,
            isMultiSelect: observable,
            searchPlaceholder: observable,
            maxHeight: observable,
            filteredItems: computed,
            selectedItems: computed,
            setSearchText: action,
            toggleSelection: action,
            clearSelection: action,
            setOpen: action,
            setItems: action,
            setConfig: action,
        });
    }

    get filteredItems(): T[] {
        if (!this.searchText.trim()) {
            return this.items;
        }
        
        const searchLower = this.searchText.toLowerCase();
        return this.items.filter(item => {
            const label = this.getItemLabel(item);
            const labelText = typeof label === 'string' ? label : String(label);
            return labelText.toLowerCase().includes(searchLower);
        });
    }

    get selectedItems(): T[] {
        return this.items.filter(item => this.selectedIds.has(this.getItemId(item)));
    }

    setSearchText(text: string) {
        this.searchText = text;
    }

    toggleSelection(itemId: string) {
        if (this.isMultiSelect) {
            if (this.selectedIds.has(itemId)) {
                this.selectedIds.delete(itemId);
            } else {
                this.selectedIds.add(itemId);
            }
        } else {
            // Single select - clear previous selection and add new one
            this.selectedIds.clear();
            this.selectedIds.add(itemId);
        }
        
        // Call onResult callback
        this.onResult?.(this.selectedItems);
    }

    clearSelection() {
        this.selectedIds.clear();
        this.onResult?.(this.selectedItems);
    }

    setOpen(open: boolean) {
        this.isOpen = open;
        if (!open) {
            // When closing, ensure result callback is called
            this.onResult?.(this.selectedItems);
        }
    }

    setItems(items: T[]) {
        this.items = items;
    }

    setConfig(config: {
        getItemId: (item: T) => string;
        getItemLabel: (item: T) => React.ReactNode;
        isMultiSelect: boolean;
        onResult?: (selectedItems: T[]) => void;
        initialSelection?: Set<string>;
    }) {
        this.getItemId = config.getItemId;
        this.getItemLabel = config.getItemLabel;
        this.isMultiSelect = config.isMultiSelect;
        this.onResult = config.onResult;
        
        if (config.initialSelection) {
            this.selectedIds = new Set(config.initialSelection);
        }
    }
}