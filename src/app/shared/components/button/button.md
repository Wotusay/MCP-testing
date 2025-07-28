# Button Component

A reusable button component with multiple variants, sizes, and event handling.

## Usage

```html
<app-button 
  text="Get Started" 
  variant="primary" 
  size="md"
  (buttonClick)="handleClick()">
</app-button>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | `''` | The button text |
| `variant` | `ButtonVariant` | `'primary'` | The button style variant |
| `size` | `ButtonSize` | `'md'` | The button size |
| `disabled` | `boolean` | `false` | Whether the button is disabled |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `buttonClick` | `EventEmitter<void>` | Emitted when the button is clicked |

## Variants

- `primary` - Blue button with white text (main actions)
- `secondary` - Gray button with dark text (secondary actions)
- `success` - Green button with white text (positive actions)
- `danger` - Red button with white text (destructive actions)

## Sizes

- `sm` - Small button (py-1 px-3 text-sm)
- `md` - Medium button (py-2 px-4) - default
- `lg` - Large button (py-3 px-6 text-lg)

## Examples

```html
<!-- Primary action -->
<app-button 
  text="Save Changes" 
  variant="primary" 
  (buttonClick)="save()">
</app-button>

<!-- Secondary action -->
<app-button 
  text="Cancel" 
  variant="secondary" 
  (buttonClick)="cancel()">
</app-button>

<!-- Success action -->
<app-button 
  text="Approve" 
  variant="success" 
  (buttonClick)="approve()">
</app-button>

<!-- Danger action -->
<app-button 
  text="Delete" 
  variant="danger" 
  (buttonClick)="delete()">
</app-button>

<!-- Disabled button -->
<app-button 
  text="Processing..." 
  variant="primary" 
  [disabled]="true">
</app-button>

<!-- Large button -->
<app-button 
  text="Get Started" 
  variant="primary" 
  size="lg" 
  (buttonClick)="getStarted()">
</app-button>
```

## Accessibility

- Proper button semantics with `<button>` element
- Disabled state with `opacity-50 cursor-not-allowed` classes
- Hover and focus states for keyboard navigation
- Semantic color choices for different actions

## Styling Features

- Smooth transitions (200ms duration)
- Consistent border radius and padding
- Hover state color changes
- Disabled state visual feedback
