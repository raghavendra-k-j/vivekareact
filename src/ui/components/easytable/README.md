# EasyTable Component

The EasyTable component is a flexible, feature-rich table component built with React and MobX. It provides a complete data table solution with pagination, sorting, selection, actions, and various state management features.

## Features

- **State Management**: Built-in loading, error, and empty states
- **Pagination**: Automatic pagination with customizable page sizes
- **Selection**: Row selection with checkboxes and bulk operations
- **Actions**: Dropdown actions menu for each row
- **Scrolling**: Optional scrollable tables with sticky headers
- **Responsive**: Flexible column sizing and responsive design
- **TypeScript**: Full TypeScript support with generic types
- **MobX Integration**: Reactive state management with MobX

## Basic Usage

```tsx
import { EasyTable, EasyTableColumn, EasyTableState, EasyTableData } from '~/ui/components/easytable';

// Define your data type
interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

// Create columns
const columns: EasyTableColumn<User>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '200px',
    sortable: true,
  },
  {
    key: 'email',
    header: 'Email',
    width: '250px',
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    renderCell: (user) => (
      <span className={user.status === 'active' ? 'text-green-600' : 'text-red-600'}>
        {user.status}
      </span>
    ),
  },
];

// Create table state (using MobX store or local state)
const tableState = () => EasyTableState.data(
  new EasyTableData({
    items: users,
    totalItems: 100,
    pageSize: 10,
    currentPage: 1,
  })
);

// Render the table
<EasyTable
  columns={columns}
  dataState={tableState}
  getRowKey={(user) => user.id}
  onPageChange={(page) => loadPage(page)}
/>
```

## Component Props

### EasyTableProps<T>

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `EasyTableColumn<T>[]` | Yes | Array of column definitions |
| `dataState` | `() => EasyTableState<T>` | Yes | Function returning current table state |
| `getRowKey` | `(item: T, index: number) => string \| number` | Yes | Function to get unique key for each row |
| `retryOptions` | `EasyTableRetryOptions` | No | Retry configuration for error states |
| `onPageChange` | `(page: number) => void` | No | Callback when page changes |
| `onRowClick` | `(item: T, index: number, event: React.MouseEvent) => void` | No | Callback when row is clicked |
| `pageSizeOptions` | `() => PageSizeOptions \| undefined` | No | Page size selection options |
| `scrollable` | `boolean \| EasyTableScrollableOptions` | No | Enable scrolling with options |
| `renderEmptyState` | `() => React.ReactNode` | No | Custom empty state renderer |
| `containerShadowClassName` | `string` | No | CSS class for container shadow |
| `containerClassName` | `string` | No | CSS class for container |
| `tableClassName` | `string` | No | CSS class for table element |
| `headerClassName` | `string` | No | CSS class for table header |
| `bodyClassName` | `string` | No | CSS class for table body |
| `rowClassName` | `string \| ((item: T, index: number) => string)` | No | CSS class for table rows |
| `footerClassName` | `string` | No | CSS class for table footer |

## Column Configuration

### EasyTableColumn<T>

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier for the column |
| `header` | `string \| React.ReactNode` | Column header content |
| `width` | `number \| string` | Fixed column width |
| `minWidth` | `number \| string` | Minimum column width |
| `maxWidth` | `number \| string` | Maximum column width |
| `align` | `'left' \| 'center' \| 'right'` | Cell text alignment |
| `headerAlign` | `'left' \| 'center' \| 'right'` | Header text alignment |
| `flex` | `boolean` | Enable flexible sizing |
| `sortable` | `boolean` | Enable column sorting |
| `renderCell` | `(item: T, index: number) => React.ReactNode` | Custom cell renderer |
| `renderHeader` | `() => React.ReactNode` | Custom header renderer |
| `cellClassName` | `string` | CSS class for cells |
| `headerClassName` | `string` | CSS class for header cell |

## State Management

### EasyTableState<T>

The table uses a state machine pattern with four states:

```typescript
// Initial state (before first load)
const initState = EasyTableState.init<User>();

// Loading state
const loadingState = EasyTableState.loading<User>();

// Data loaded state
const dataState = EasyTableState.data(
  new EasyTableData({
    items: users,
    totalItems: 100,
    pageSize: 10,
    currentPage: 1,
  })
);

// Error state
const errorState = EasyTableState.error<User>(new Error('Failed to load data'));
```

### EasyTableData<T>

Represents paginated data:

```typescript
const tableData = new EasyTableData({
  items: currentPageItems,
  totalItems: totalCount,
  pageSize: 10,
  currentPage: 1,
});

// Computed properties
console.log(tableData.totalPages);     // Total number of pages
console.log(tableData.hasNextPage);    // Boolean
console.log(tableData.hasPreviousPage); // Boolean
console.log(tableData.isEmpty);        // Boolean
```

## Advanced Features

### Row Selection

```tsx
import { EasyTableSelect } from '~/ui/components/easytable';

const columns: EasyTableColumn<User>[] = [
  {
    key: 'select',
    header: <EasyTableSelect
      selected={allSelected}
      intermediate={someSelected}
      onChange={handleSelectAll}
    />,
    width: '50px',
    renderCell: (user, index) => (
      <EasyTableSelect
        selected={selectedIds.includes(user.id)}
        onChange={(selected) => handleSelectUser(user.id, selected)}
      />
    ),
  },
  // ... other columns
];
```

### Row Actions

```tsx
import { EasyTableActions, EasyTableAction } from '~/ui/components/easytable';

const columns: EasyTableColumn<User>[] = [
  // ... other columns
  {
    key: 'actions',
    header: 'Actions',
    width: '100px',
    renderCell: (user) => {
      const actions: EasyTableAction[] = [
        {
          key: 'edit',
          label: 'Edit',
          icon: <EditIcon />,
          onClick: () => handleEdit(user),
        },
        {
          key: 'delete',
          label: 'Delete',
          variant: 'destructive',
          icon: <TrashIcon />,
          onClick: () => handleDelete(user),
        },
      ];

      return <EasyTableActions actions={actions} />;
    },
  },
];
```

### Scrollable Tables

```tsx
<EasyTable
  columns={columns}
  dataState={tableState}
  getRowKey={(item) => item.id}
  scrollable={{
    maxHeight: '400px',
    stickyHeader: true,
  }}
/>
```

### Custom Empty State

```tsx
<EasyTable
  columns={columns}
  dataState={tableState}
  getRowKey={(item) => item.id}
  renderEmptyState={() => (
    <EasyTableEmptyState
      icon={<UsersIcon />}
      message="No users found"
      description="Try adjusting your search criteria"
    />
  )}
/>
```

### Error Handling with Retry

```tsx
<EasyTable
  columns={columns}
  dataState={tableState}
  getRowKey={(item) => item.id}
  retryOptions={{
    label: 'Try Again',
    onClick: () => refetchData(),
  }}
/>
```

### Page Size Selection

```tsx
const pageSizeOptions = () => ({
  options: [10, 25, 50, 100],
  currentSize: 25,
  onSizeChange: (size) => setPageSize(size),
});

<EasyTable
  columns={columns}
  dataState={tableState}
  getRowKey={(item) => item.id}
  pageSizeOptions={pageSizeOptions}
/>
```

## Integration with MobX

The component is designed to work seamlessly with MobX stores:

```typescript
import { makeObservable, observable, action, computed } from 'mobx';
import { EasyTableState, EasyTableData } from '~/ui/components/easytable';

class UsersStore {
  @observable users: User[] = [];
  @observable totalCount = 0;
  @observable currentPage = 1;
  @observable pageSize = 10;
  @observable isLoading = false;
  @observable error: Error | null = null;

  constructor() {
    makeObservable(this);
  }

  @computed
  get tableState() {
    if (this.error) {
      return EasyTableState.error(this.error);
    }
    if (this.isLoading && this.users.length === 0) {
      return EasyTableState.loading();
    }
    return EasyTableState.data(
      new EasyTableData({
        items: this.users,
        totalItems: this.totalCount,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      })
    );
  }

  @action
  async loadUsers(page = 1) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await api.getUsers({ page, pageSize: this.pageSize });
      this.users = response.data;
      this.totalCount = response.total;
      this.currentPage = page;
    } catch (error) {
      this.error = error as Error;
    } finally {
      this.isLoading = false;
    }
  }
}

// In component
const store = useUsersStore();

<EasyTable
  columns={columns}
  dataState={() => store.tableState}
  getRowKey={(user) => user.id}
  onPageChange={(page) => store.loadUsers(page)}
/>
```

## Styling

The component uses Tailwind CSS classes and can be customized through various className props:

- `containerClassName`: Main container
- `tableClassName`: Table element
- `headerClassName`: Table header
- `bodyClassName`: Table body
- `rowClassName`: Individual rows (can be a function)
- `footerClassName`: Table footer

## Accessibility

- Proper semantic table markup
- Keyboard navigation support
- Screen reader friendly
- Focus management for interactive elements

## Performance

- Virtual scrolling support through `scrollable` prop
- Efficient re-rendering with MobX observables
- Lazy loading support through pagination
- Minimal DOM updates

## Best Practices

1. **Key Generation**: Always provide a stable `getRowKey` function
2. **State Management**: Use MobX stores for complex state management
3. **Error Handling**: Implement proper error states with retry options
4. **Loading States**: Show loading indicators during data fetching
5. **Pagination**: Use appropriate page sizes for your data
6. **Responsive Design**: Consider column widths and mobile layouts
7. **TypeScript**: Leverage the generic types for type safety
8. **Performance**: Use scrolling for large datasets</content>
<parameter name="filePath">d:\RKJ\Projects\VivekaFinal\vivekareactfinal\src\ui\components\easytable\README.md