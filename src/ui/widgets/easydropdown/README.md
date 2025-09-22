# EasyDropDown Widget

A simple, reusable dropdown menu component built on top of Radix UI Dropdown Menu.

## Components

- `EasyDropDown` - The root container component
- `EasyDropDownTrigger` - The trigger element that opens the dropdown
- `EasyDropDownContent` - The dropdown content container
- `EasyDropDownItem` - Individual menu items with optional icons and variants
- `EasyDropDownSeparator` - Visual separator between menu sections

## Basic Usage

```tsx
import { EasyDropDown, EasyDropDownTrigger, EasyDropDownContent, EasyDropDownItem } from "~/ui/widgets/easydropdown";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { IconButton } from "~/ui/widgets/button/IconButton";

function MyComponent() {
    return (
        <EasyDropDown>
            <EasyDropDownTrigger>
                <IconButton
                    icon={<MoreVertical className="w-4 h-4" />}
                    size="sm"
                    variant="ghost"
                />
            </EasyDropDownTrigger>
            <EasyDropDownContent>
                <EasyDropDownItem
                    icon={<Pencil className="w-4 h-4" />}
                    onClick={() => console.log("Edit clicked")}
                >
                    Edit
                </EasyDropDownItem>
                <EasyDropDownItem
                    icon={<Trash2 className="w-4 h-4" />}
                    variant="destructive"
                    onClick={() => console.log("Delete clicked")}
                >
                    Delete
                </EasyDropDownItem>
                <EasyDropDownItem
                    icon={<Eye className="w-4 h-4" />}
                    disabled={true}
                    onClick={() => console.log("View clicked")}
                >
                    View (Coming Soon)
                </EasyDropDownItem>
            </EasyDropDownContent>
        </EasyDropDown>
    );
}
```

## Props

### EasyDropDown
- `open?: boolean` - Controlled open state
- `defaultOpen?: boolean` - Default open state
- `onOpenChange?: (open: boolean) => void` - Callback when open state changes

### EasyDropDownTrigger
- `asChild?: boolean` - Whether to use the child as the trigger element
- `children: React.ReactElement` - The trigger element

### EasyDropDownContent
- `side?: "top" | "right" | "bottom" | "left"` - Side to position the dropdown
- `align?: "start" | "center" | "end"` - Alignment of the dropdown
- `sideOffset?: number` - Offset from the trigger
- `className?: string` - Additional CSS classes

### EasyDropDownItem
- `icon?: React.ReactNode` - Icon to display
- `children: React.ReactNode` - Item content
- `variant?: "default" | "destructive"` - Visual variant
- `disabled?: boolean` - Whether the item is disabled
- `className?: string` - Additional CSS classes
- All other Radix DropdownMenu.Item props

### EasyDropDownSeparator
- `className?: string` - Additional CSS classes

## Variants

- `default` - Standard menu item with gray text
- `destructive` - Red text for dangerous actions like delete

## Customization

The component uses sensible defaults but can be customized via className props and by providing custom trigger elements.