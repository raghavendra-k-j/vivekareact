# Tabs Component

A flexible and accessible tab navigation component built with React and TypeScript.

## Components

### TabsList

A container component for tab items that supports horizontal scrolling and drag-to-scroll functionality.

**Props:**
- `children`: React.ReactNode - The tab items to render
- `className?: string` - Optional CSS class for additional styling

**Features:**
- Horizontal scrolling for overflow
- Drag-to-scroll support on touch devices
- Accessible with `role="tablist"` and `aria-orientation="horizontal"`

### TabItem

An individual tab button component.

**Props:**
- `children`: React.ReactNode - The content to display in the tab
- `className?: string` - Optional CSS class for additional styling
- `isActive?: boolean` - Whether the tab is currently active
- `onClick?: (ev?: React.MouseEvent) => void` - Click handler for the tab

**Features:**
- Accessible with `role="tab"` and `aria-selected`
- Visual feedback for active state
- Hover effects
- Smooth transitions

## Usage

```tsx
import { TabsList, TabItem } from "~/ui/widgets/tabs/TabList";
import { TabsList, TabItem } from "~/ui/widgets/tabs/TabItem";

// Basic usage
function MyTabs() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <TabsList>
            <TabItem
                isActive={activeTab === 0}
                onClick={() => setActiveTab(0)}
            >
                Tab 1
            </TabItem>
            <TabItem
                isActive={activeTab === 1}
                onClick={() => setActiveTab(1)}
            >
                Tab 2
            </TabItem>
        </TabsList>
    );
}

// With routing (example from OrgSettingsLayout)
function NavigationTabs() {
    const navigate = useNavigate();
    const tabs = [
        { to: "/path1", label: "Tab 1" },
        { to: "/path2", label: "Tab 2" },
    ];

    return (
        <TabsList className="px-6 border-t border-default">
            {tabs.map(t => {
                const isTabActive = useIsLinkActive(t.to, true);
                return (
                    <TabItem
                        key={t.to}
                        isActive={isTabActive}
                        onClick={() => navigate(t.to)}
                    >
                        {t.label}
                    </TabItem>
                );
            })}
        </TabsList>
    );
}
```

## Styling

The component uses CSS modules (`TabList.module.css`) with CSS custom properties for theming:

- `--color-text-secondary`: Default text color
- `--color-primary`: Active/hover text color and border color

Default styles include:
- Flex layout with horizontal scrolling
- Padding and font weight for tab items
- Bottom border that becomes colored when active
- Smooth transitions for state changes

## Accessibility

- Uses semantic HTML with `role="tablist"` and `role="tab"`
- Proper ARIA attributes (`aria-selected`, `aria-orientation`)
- Keyboard navigation support through button elements
- Screen reader friendly

## Dependencies

- `clsx` for conditional CSS classes
- `~/ui/hooks/useEnableDragScroll` for drag scrolling functionality</content>
<parameter name="filePath">d:\RKJ\Projects\VivekaFinal\vivekareactfinal\src\ui\widgets\tabs\README.md