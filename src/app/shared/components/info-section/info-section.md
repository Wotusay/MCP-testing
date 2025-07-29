# InfoSection Component

A reusable component for displaying titled sections with bulleted lists of information.

## Purpose

The InfoSection component provides a consistent way to display structured information in sections with a title and a list of items. It's commonly used for features lists, technology stacks, and other categorized information.

## Usage

### Basic Usage

```typescript
import { InfoSectionComponent, InfoItem } from '../../shared';

@Component({
  template: `
    <app-info-section
      title="Key Features"
      [items]="features"
    ></app-info-section>
  `
})
export class MyComponent {
  features: InfoItem[] = [
    { text: 'Angular 20 with zoneless change detection' },
    { text: 'Lazy loading for optimal performance' },
    { text: 'OnPush change detection strategy' }
  ];
}
```

### With Descriptions

```typescript
techStack: InfoItem[] = [
  { 
    text: 'Angular 20', 
    description: 'Modern frontend framework' 
  },
  { 
    text: 'TypeScript', 
    description: 'Type-safe development' 
  }
];
```

## API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `''` | The section title displayed above the list |
| `items` | `InfoItem[]` | `[]` | Array of items to display in the bulleted list |

### InfoItem Interface

```typescript
interface InfoItem {
  text: string;        // Main text content (required)
  description?: string; // Optional description text
}
```

## Features

- **Responsive Design**: Uses Tailwind CSS for consistent styling
- **OnPush Change Detection**: Optimized for performance
- **Accessible**: Uses semantic HTML with proper heading hierarchy
- **Flexible**: Supports optional descriptions for each item

## Used In

- About page: Key Features and Technology Stack sections
- Any component needing structured information display

## Styling

The component uses Tailwind CSS classes:
- `text-xl font-semibold text-gray-900` for titles
- `list-disc list-inside space-y-2` for bulleted lists
- `text-gray-600` for descriptions