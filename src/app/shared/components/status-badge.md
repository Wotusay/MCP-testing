# Status Badge Component

A reusable status badge component for displaying status information with different visual variants.

## Usage

```html
<app-status-badge 
  text="Development" 
  variant="success">
</app-status-badge>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | `''` | The text to display inside the badge |
| `variant` | `BadgeVariant` | `'success'` | The visual style variant |

## Variants

- `success` - Green background with dark green text
- `warning` - Yellow background with dark yellow text  
- `error` - Red background with dark red text
- `info` - Blue background with dark blue text

## Examples

```html
<!-- Success badge -->
<app-status-badge text="Active" variant="success"></app-status-badge>

<!-- Warning badge -->
<app-status-badge text="Pending" variant="warning"></app-status-badge>

<!-- Error badge -->
<app-status-badge text="Failed" variant="error"></app-status-badge>

<!-- Info badge -->
<app-status-badge text="Processing" variant="info"></app-status-badge>
```

## CSS Classes Applied

The component automatically applies Tailwind CSS classes based on the variant:
- Base classes: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`
- Variant-specific classes are added dynamically
