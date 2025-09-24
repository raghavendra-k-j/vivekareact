# Design Tokens Usage Guide

## Text Color Tokens

Use these CSS classes to apply consistent text colors throughout the application:

### Basic Text Colors
```html
<!-- Strong text (highest contrast, for headings/important text) -->
<h1 class="text-strong">Main Heading</h1>

<!-- Default text (primary body text) -->
<p class="text-default">This is regular body text content.</p>

<!-- Secondary text (less important information) -->
<span class="text-secondary">Additional details or metadata</span>

<!-- Tertiary text (least important, subtle text) -->
<small class="text-tertiary">Copyright notice or fine print</small>
```

### Semantic Text Colors
```html
<!-- Error messages -->
<div class="text-error">This field is required</div>

<!-- Success messages -->
<div class="text-success">Operation completed successfully</div>
```

### Text on Colored Backgrounds
```html
<!-- Text on primary colored backgrounds -->
<button class="text-on-primary">
  Text on Primary Background
</button>
```

## Border Color Tokens

Use these CSS classes to apply consistent border colors:

```html
<!-- Default border (standard form inputs, cards) -->
<div class="border border-default">Default border</div>

<!-- Strong border (emphasis, active states) -->
<div class="border border-strong">Strong border</div>

<!-- Secondary border (subtle separation) -->
<div class="border border-secondary">Secondary border</div>

<!-- Tertiary border (very subtle, minimal separation) -->
<div class="border border-tertiary">Tertiary border</div>
```

## Divider Color Tokens

Use these CSS classes to create consistent dividers between elements:

```html
<!-- Strong divider (major section breaks) -->
<div class="divide-strong">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Default divider (standard list separation) -->
<ul class="divide-default">
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</ul>

<!-- Secondary divider (subtle separation) -->
<div class="divide-secondary">
  <section>Section 1</section>
  <section>Section 2</section>
</div>

<!-- Tertiary divider (minimal separation) -->
<div class="divide-tertiary">
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</div>
```

### Usage Guidelines

1. **Text Hierarchy**: Use `text-strong` for headings, `text-default` for body text, `text-secondary` for supporting text, and `text-tertiary` for the least important information.

2. **Border Hierarchy**: Use `border-strong` for emphasis, `border-default` for standard elements, `border-secondary` for subtle separation, and `border-tertiary` for minimal separation.

3. **Divider Hierarchy**: Follow the same pattern as borders - `divide-strong` for major breaks, `divide-default` for standard separation, etc.

4. **Semantic Colors**: Use `text-error` and `text-success` only for their intended purposes.

5. **Consistency**: Always use these design tokens instead of custom color values to maintain visual consistency.

### Example Component Usage
```tsx
function UserCard({ user }: { user: User }) {
  return (
    <div className="border border-default rounded p-4">
      <h3 className="text-default">{user.name}</h3>
      <p className="text-default">{user.bio}</p>
      <div className="divide-secondary mt-4">
        <span className="text-secondary">Joined {user.joinDate}</span>
        {user.isVerified && (
          <span className="text-success">✓ Verified</span>
        )}
      </div>
    </div>
  );
}
```
