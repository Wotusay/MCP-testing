# Feature Card Component

A reusable card component for displaying features with icons, titles, and descriptions.

## Usage

```html
<app-feature-card
  title="Angular 20"
  description="Latest Angular version with zoneless architecture."
  iconPath="M12 2L2 7v10c0 5.55 3.84 12 9 12s9-6.45 9-12V7l-10-5z"
  iconColor="red">
</app-feature-card>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `''` | The title text for the card |
| `description` | `string` | `''` | The description text for the card |
| `iconPath` | `string` | `''` | SVG path data for the icon |
| `iconColor` | `'red' \| 'cyan' \| 'green' \| 'blue' \| 'purple'` | `'blue'` | Color theme for the icon |

## Icon Colors

- `red` - Red background with dark red icon
- `cyan` - Cyan background with dark cyan icon
- `green` - Green background with dark green icon
- `blue` - Blue background with dark blue icon
- `purple` - Purple background with dark purple icon

## Examples

```html
<!-- Technology card -->
<app-feature-card
  title="React"
  description="A JavaScript library for building user interfaces."
  iconPath="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236A2.236 2.236 0 0 1 12 9.768a2.236 2.236 0 0 1 2.23 2.236z"
  iconColor="cyan">
</app-feature-card>

<!-- Service card -->
<app-feature-card
  title="Security"
  description="Enterprise-grade security with encryption and monitoring."
  iconPath="M12 1l9 4-9 4-9-4 9-4zm0 12l-9-4v6l9 4v-6zm0 0l9-4v6l-9 4v-6z"
  iconColor="green">
</app-feature-card>
```

## Getting SVG Icon Paths

You can get SVG paths from:
- [Heroicons](https://heroicons.com/) - Copy the path data from SVG
- [Feather Icons](https://feathericons.com/) - Copy the path data
- Custom SVGs - Extract the `<path d="...">` attribute value

## Layout

- Cards are designed to work in CSS Grid layouts
- Responsive padding and spacing
- Consistent shadow and border radius
- Icon container is 48x48px (12 units in Tailwind)
