# MobX Usage Patterns in Viveka Application

## Core MobX Patterns Used

### 1. Store Structure with makeObservable
```typescript
export class TopicsStore {
    // Observable properties
    searchQuery: string = "";
    isLoading: boolean = false;
    dataState: DataState<Topic[]> = DataState.init();

    // References to other stores
    layoutStore: CourseLayoutStore;
    dialogManager: DialogManagerStore;

    constructor({ layoutStore, dialogManager }: {
        layoutStore: CourseLayoutStore;
        dialogManager: DialogManagerStore;
    }) {
        this.layoutStore = layoutStore;
        this.dialogManager = dialogManager;

        makeObservable(this, {
            searchQuery: observable,
            isLoading: observable,
            dataState: observable.ref,  // Use observable.ref for complex objects
            loadTopics: action,
            updateSearchQuery: action,
        });
    }
}
```

### 2. Observable Property Types

#### Basic Observables
```typescript
searchQuery: string = "";
currentPage: number = 1;
isLoading: boolean = false;
```

#### observable.ref for Complex Objects
```typescript
dataState: DataState<Topic[]> = DataState.init();  // Use observable.ref
userProfile: UserProfile | null = null;           // Use observable.ref
```

#### observable.shallow for Arrays/Sets
```typescript
selectedIds: Set<number> = new Set();  // Use observable.shallow
items: Topic[] = [];                   // Use observable.shallow
```

### 3. Action Methods

#### Synchronous Actions
```typescript
updateSearchQuery(query: string) {
    this.searchQuery = query;
}
```

#### Asynchronous Actions with runInAction
```typescript
async loadTopics() {
    runInAction(() => {
        this.isLoading = true;
        this.dataState = DataState.loading();
    });

    try {
        const topics = await this.layoutStore.courseService.getTopics();
        runInAction(() => {
            this.dataState = DataState.data(topics);
            this.isLoading = false;
        });
    } catch (error) {
        runInAction(() => {
            this.dataState = DataState.error(AppError.fromAny(error));
            this.isLoading = false;
        });
    }
}
```

### 4. React Components with Observer

```tsx
import { Observer } from "mobx-react-lite";

function TopicsPage() {
    const store = useTopicsStore();

    return (
        <Observer>
            {() => (
                <div>
                    <input
                        value={store.searchQuery}
                        onChange={(e) => store.updateSearchQuery(e.target.value)}
                    />
                    {store.isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <TopicsList topics={store.dataState.data || []} />
                    )}
                </div>
            )}
        </Observer>
    );
}
```

### 5. Dialog Management Pattern

```typescript
showCreateTopicDialog() {
    this.dialogManager.show({
        id: "create-topic-dialog",
        component: UpsertTopicDialog,
        props: {
            mode: "create",
            store: this,
            onClose: () => this.dialogManager.closeById("create-topic-dialog"),
        },
    });
}
```

## Key Conventions

1. **Always use `makeObservable`** with explicit property declarations
2. **Use `observable.ref`** for DataState and complex objects that change entirely
3. **Use `observable.shallow`** for arrays and Sets
4. **Wrap state changes in `runInAction`** for async operations
5. **Use Observer components** for reactive rendering
6. **Use dialogManager** for showing dialogs instead of conditional rendering
