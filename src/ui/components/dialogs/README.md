# Dialog Components

This folder contains reusable dialog components and utilities built on top of the Dialog Manager system. It provides pre-built dialogs for common use cases and utilities for showing them programmatically.

## Available Dialogs

### BasicErrorDialog
A simple error dialog with optional message, description, and action buttons.

```tsx
import { BasicErrorDialog } from './BasicErrorDialog';

<BasicErrorDialog
  message="Error occurred"
  description="Something went wrong. Please try again."
  primaryButton={{ text: "Retry", onClick: handleRetry }}
  secondaryButton={{ text: "Cancel", onClick: handleCancel }}
/>
```

### CourseCodeDialog
A dialog for displaying and copying course codes in a prominent format.

```tsx
import { CourseCodeDialog } from './CourseCodeDialog';

<CourseCodeDialog
  courseCode="ABC123"
  courseLabel="Course"
/>
```

### Showing Course Code Dialog Programmatically
```tsx
import { showCourseCodeDialog } from './showCourseCodeDialog';

showCourseCodeDialog({
  dialogManager,
  courseCode: "ABC123",
  courseLabel: "Course"
});
```

## Showing Dialogs Programmatically

Use the provided utility functions to show dialogs through the Dialog Manager:

### Error Dialog
```tsx
import { showErrorDialog } from './showErrorDialog';

showErrorDialog({
  dialogManager,
  message: "Failed to save",
  description: "Please check your connection and try again.",
  primaryButton: { text: "Retry", onClick: handleRetry },
  secondaryButton: { text: "Cancel", onClick: handleCancel }
});
```

### Loading Dialog
```tsx
import { showLoadingDialog } from './showLoadingDialog';

showLoadingDialog({
  dialogManager,
  message: "Processing your request..."
});
```

### App Error Dialog
```tsx
import { showAppErrorDialog } from './showAppErrorDialog';

showAppErrorDialog({
  dialogManager,
  appError: myAppError,
  primaryButton: { text: "OK", onClick: () => {} }
});
```

## Creating Custom Dialogs

### Using Dialog Manager Components

Create custom dialogs by composing the base components from the Dialog Manager:

```tsx
import { Dialog, DialogOverlay, DialogScaffold, DialogContent, useDialog } from '~/ui/widgets/dialogmanager';
import { DialogHeader, DialogFooter } from './DialogHeaderAndFooter';

interface CustomDialogProps {
  title: string;
  content: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
}

function CustomDialog({ title, content, onConfirm, confirmText = "Confirm" }: CustomDialogProps) {
  const { onClose } = useDialog();

  return (
    <Dialog onClose={onClose}>
      <DialogOverlay />
      <DialogScaffold>
        <DialogContent>
          <DialogHeader
            title={title}
            onClose={<DialogCloseButton onClick={onClose} />}
          />
          <div className="p-4">
            {content}
          </div>
          <DialogFooter
            actions={
              <>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm}>{confirmText}</Button>
              </>
            }
          />
        </DialogContent>
      </DialogScaffold>
    </Dialog>
  );
}
```

### Using Radix UI Components

For more complex dialogs, use the Radix UI based components:

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from './dialog';

function RadixDialogExample() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogHeader>
        <div>Dialog content</div>
        <DialogFooter>
          <Button>Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Dialog Header and Footer Components

### DialogHeader
Consistent header component with optional leading content, title, and close button.

```tsx
<DialogHeader
  title="My Dialog"
  leading={<Icon />}
  onClose={<DialogCloseButton onClick={onClose} />}
/>
```

### DialogFooter
Footer component for action buttons.

```tsx
<DialogFooter
  actions={
    <>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </>
  }
/>
```

### DialogCustomFooter
More flexible footer with start and end content.

```tsx
<DialogCustomFooter
  start={<SelectAllCheckbox value={selectAll} onChange={setSelectAll} />}
  end={<Button>Apply</Button>}
/>
```

## Best Practices

1. Use descriptive dialog IDs when showing programmatically
2. Provide proper ARIA labels and descriptions
3. Handle dialog state properly (loading, error states)
4. Use consistent styling with the provided header/footer components
5. Consider mobile responsiveness
6. Always provide a way to close the dialog (Escape key, close button, overlay click)

## Integration

These components work seamlessly with the Dialog Manager system in `ui/widgets/dialogmanager`. For programmatic dialog management, inject the `DialogManagerStore` and use the `show*` utility functions.</content>
<parameter name="filePath">d:\RKJ\Projects\VivekaFinal\vivekareactfinal\src\ui\components\dialogs\README.md