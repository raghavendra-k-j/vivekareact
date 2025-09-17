# EasySelect Component

A clean, customizable, and fully generic select dialog component with search functionality built on top of Popover and MobX state management.

## Features

- **Generic Type Support**: Works with any data type `T`
- **Single & Multi-Select**: Configurable selection mode
- **Search Functionality**: Built-in search with instant filtering
- **Fully Customizable**: Custom trigger elements, labels, and item rendering
- **Popover Integration**: Uses existing Popover component for consistent UI
- **MobX State Management**: Reactive state updates
- **Accessible**: Keyboard navigation and ARIA support
- **TypeScript**: Full type safety

## Basic Usage

```tsx
import { EasySelect } from "~/ui/widgets/easyselect";
import { Button } from "~/ui/widgets/button/Button";

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

function MyComponent() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <EasySelect<User>
      items={users}
      getItemId={(user) => user.id}
      getItemLabel={(user) => user.name}
      onResult={(selected) => setSelectedUsers(selected)}
      trigger={<Button>Select Users</Button>}
    />
  );
}
```

## Props

### Core Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `T[]` | ✅ | Array of items to select from |
| `getItemId` | `(item: T) => string` | ✅ | Function to extract unique ID from item |
| `getItemLabel` | `(item: T) => ReactNode` | ✅ | Function to render item label |
| `onResult` | `(selectedItems: T[]) => void` | ✅ | Callback when selection changes |
| `trigger` | `ReactNode` | ✅ | Element that triggers the popover |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isMultiSelect` | `boolean` | `false` | Enable multi-selection mode |
| `initialSelection` | `Set<string>` | `undefined` | Pre-selected item IDs |

### UI Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `undefined` | Placeholder text for empty state |
| `searchPlaceholder` | `string` | `"Search items..."` | Search input placeholder |
| `maxHeight` | `string` | `"15rem"` | Maximum height of the items list |
| `className` | `string` | `undefined` | Additional CSS classes |

### Popover Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `popoverProps.side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Popover position |
| `popoverProps.align` | `"start" \| "center" \| "end"` | `"start"` | Popover alignment |
| `popoverProps.sideOffset` | `number` | `4` | Distance from trigger |
| `popoverProps.matchTriggerWidth` | `boolean` | `true` | Match popover width to trigger |

## Examples

### Single Select

```tsx
<EasySelect<Product>
  items={products}
  getItemId={(product) => product.id}
  getItemLabel={(product) => product.name}
  onResult={(selected) => setSelectedProduct(selected[0])}
  isMultiSelect={false}
  trigger={<Button>Select Product</Button>}
/>
```

### Multi Select with Rich Labels

```tsx
<EasySelect<User>
  items={users}
  getItemId={(user) => user.id}
  getItemLabel={(user) => (
    <div>
      <div className="font-medium">{user.name}</div>
      <div className="text-xs text-gray-500">{user.email}</div>
    </div>
  )}
  onResult={(selected) => setSelectedUsers(selected)}
  isMultiSelect={true}
  trigger={<Button>Select Users ({selectedUsers.length})</Button>}
  searchPlaceholder="Search by name or email..."
/>
```

### Custom Trigger

```tsx
<EasySelect<Option>
  items={options}
  getItemId={(opt) => opt.id}
  getItemLabel={(opt) => opt.label}
  onResult={handleSelection}
  trigger={
    <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">
      Custom Trigger Element
    </div>
  }
/>
```

### Pre-selected Items

```tsx
<EasySelect<User>
  items={users}
  getItemId={(user) => user.id}
  getItemLabel={(user) => user.name}
  onResult={handleResult}
  isMultiSelect={true}
  initialSelection={new Set(["user1", "user3"])}
  trigger={<Button>Users</Button>}
/>
```

### Custom Popover Position

```tsx
<EasySelect<Item>
  items={items}
  getItemId={(item) => item.id}
  getItemLabel={(item) => item.name}
  onResult={handleResult}
  trigger={<Button>Select</Button>}
  popoverProps={{
    side: "top",
    align: "center",
    matchTriggerWidth: false,
    sideOffset: 8
  }}
/>
```

## Advanced Usage

### Integration with Forms

```tsx
import { FValue } from "~/ui/widgets/form/FValue";

function FormExample() {
  const selectedUser = new FValue<User | null>(null);

  return (
    <EasySelect<User>
      items={users}
      getItemId={(user) => user.id}
      getItemLabel={(user) => user.name}
      onResult={(selected) => selectedUser.set(selected[0] || null)}
      trigger={
        <Button variant="outline">
          {selectedUser.value?.name || "Select User"}
        </Button>
      }
    />
  );
}
```

### With Search Debouncing

The search is automatically debounced internally, but you can customize the filtering logic:

```tsx
<EasySelect<User>
  items={users}
  getItemId={(user) => user.id}
  getItemLabel={(user) => (
    <div>
      <div>{user.name}</div>
      <div className="text-xs text-gray-500">{user.email}</div>
    </div>
  )}
  onResult={handleResult}
  trigger={<Button>Search Users</Button>}
  searchPlaceholder="Search by name or email..."
/>
```

The component automatically searches through the label text content.

## State Management

The component uses MobX for internal state management. You can access the store if needed:

```tsx
import { useEasySelectStore } from "~/ui/widgets/easyselect";

function CustomComponent() {
  const store = useEasySelectStore<MyType>();
  
  // Access store properties:
  // store.searchText
  // store.selectedIds 
  // store.filteredItems
  // store.selectedItems
}
```

## Styling

The component uses CSS classes that can be customized:

```css
/* Custom styling */
.easy-select-item {
  @apply px-4 py-2 hover:bg-gray-50 cursor-pointer;
}

.easy-select-item.selected {
  @apply bg-blue-50 text-blue-700;
}
```

## TypeScript Support

Full TypeScript support with generic types:

```tsx
interface MyItem {
  id: string;
  label: string;
  metadata?: any;
}

// Type is automatically inferred
<EasySelect<MyItem>
  items={myItems}
  getItemId={(item) => item.id} // string
  getItemLabel={(item) => item.label} // string
  onResult={(selected) => {
    // selected: MyItem[]
  }}
  trigger={<Button>Select</Button>}
/>
```

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly

## Dependencies

- `mobx` and `mobx-react-lite` for state management
- `lucide-react` for icons
- `clsx` for className management
- `../popover/Popover` component
- `../search/SearchInput` component
- `../form/Checkbox` component
- `../button/Button` component