# AvatarColorPicker Component

A reusable React component for selecting avatar colors with both predefined color palettes and custom color support.

## Features

- **Separated color palettes**: Dark colors (16) and Light colors (8) for easy selection
- **Custom color picker** with separate background and text color controls
- **Real-time preview** of custom color combinations
- **Responsive design** with hover effects and selection indicators
- **TypeScript support** with proper type definitions

## Usage

```tsx
import { AvatarColorPicker } from "~/ui/components/avatarcolorpicker";

function MyComponent() {
    const [selectedColor, setSelectedColor] = useState<AvatarColor | null>(null);

    return (
        <AvatarColorPicker
            value={selectedColor}
            onChange={setSelectedColor}
            className="my-custom-class"
        />
    );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `AvatarColor \| null` | Yes | Currently selected color |
| `onChange` | `(color: AvatarColor \| null) => void` | Yes | Callback when color changes |
| `className` | `string` | No | Additional CSS classes |

## Color Palettes

### Dark Colors (16 colors)
Vibrant colors with white text for optimal contrast:
- Blue, Red, Green, Yellow, Purple, Cyan, Orange, Lime
- Pink, Indigo, Teal, Rose, Brown, Slate, Violet, Emerald

### Light Colors (8 colors)
Soft pastel colors with dark text for optimal contrast:
- Light Blue, Light Red, Light Green, Light Yellow
- Light Pink, Light Indigo, Light Teal, Light Rose

## Custom Colors

Users can create fully custom color combinations:

- **Background Color**: Visual color picker + hex input
- **Text Color**: Separate visual color picker + hex input
- **Live Preview**: See how the combination looks in real-time
- **Flexible Control**: Mix and match any background/text color combination

## Accessibility

- Proper ARIA labels and titles for screen readers
- Keyboard navigation support
- High contrast selection indicators
- Semantic HTML structure with clear section headings