# Dialog Manager

The Dialog Manager is a custom React dialog management system built with MobX for state management. It provides a programmatic way to show, manage, and close dialogs in a React application.

## Architecture

The system consists of several key components:

- **DialogManagerProvider**: React context provider that creates the dialog store and renders the DialogRenderer.
- **DialogManagerStore**: MobX store that manages the dialog stack.
- **DialogEntry**: Type definition for dialog entries containing id, component, and props.
- **DialogRenderer**: Component that renders all active dialogs using React portals.
- **DialogContext**: Context for individual dialogs to access close functionality.
- **Dialog**: Base dialog component with overlay, scaffold, and content sub-components.

## Usage

### Setup

Wrap your app with the DialogManagerProvider:

```tsx
import { DialogManagerProvider } from './ui/widgets/dialogmanager';

function App() {
  return (
    <DialogManagerProvider>
      {/* Your app content */}
    </DialogManagerProvider>
  );
}
```

Ensure there's a DOM element with id "dialog-manager-root" for portal rendering:

```html
<div id="dialog-manager-root"></div>
```

### Showing Dialogs

Access the dialog manager store and show dialogs:

```tsx
import { useDialogManager } from './ui/widgets/dialogmanager';

function MyComponent() {
  const dialogManager = useDialogManager();

  const showDialog = () => {
    dialogManager.show({
      id: 'my-dialog',
      component: MyDialogComponent,
      props: { title: 'Hello', onConfirm: () => console.log('Confirmed') }
    });
  };

  return <button onClick={showDialog}>Show Dialog</button>;
}
```

### Creating Custom Dialogs

Create a dialog component using the provided base components:

```tsx
import { Dialog, DialogOverlay, DialogScaffold, DialogContent, useDialog } from './ui/widgets/dialogmanager';

interface MyDialogProps {
  title: string;
  onConfirm: () => void;
}

function MyDialog({ title, onConfirm }: MyDialogProps) {
  const { onClose } = useDialog();

  return (
    <Dialog onClose={onClose}>
      <DialogOverlay />
      <DialogScaffold>
        <DialogContent>
          <h2>{title}</h2>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </DialogContent>
      </DialogScaffold>
    </Dialog>
  );
}
```

### Dialog Management Methods

The DialogManagerStore provides these methods:

- `show<T>(dialog: DialogEntry<T>)`: Add a dialog to the stack
- `pop()`: Remove the top dialog
- `closeById(id: string)`: Close dialog by ID
- `closeByIds(ids: string[])`: Close multiple dialogs by IDs
- `closeAll()`: Close all dialogs

## Base Components

### Dialog
Main dialog wrapper that handles keyboard events (Escape to close).

### DialogOverlay
Backdrop overlay that closes dialog when clicked.

### DialogScaffold
Container that can close dialog when clicked (useful for modal-like behavior).

### DialogContent
Content area that prevents event propagation to parent elements.

### FramedDialog
Convenience component combining Dialog, DialogOverlay, DialogScaffold, and DialogContent.

## Best Practices

1. Always provide unique IDs for dialogs
2. Use the useDialog hook within dialog components to access close functionality
3. Handle dialog props properly in your custom components
4. Use portals for proper z-index management
5. Consider accessibility (keyboard navigation, focus management)

## Integration with Existing Dialogs

This system is designed to work alongside existing dialog implementations. The `ui/components/dialogs` folder contains pre-built dialogs that utilize this manager.</content>
<parameter name="filePath">d:\RKJ\Projects\VivekaFinal\vivekareactfinal\src\ui\widgets\dialogmanager\README.md