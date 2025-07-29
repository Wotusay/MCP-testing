# InfoCard Component

A reusable component for displaying information in card format.

## Purpose

The InfoCard component provides a consistent way to display paired information (title and content) in a card-like container. It's commonly used for contact information, project details, and other key-value pairs.

## Usage

### Basic Usage

```typescript
import { InfoCardComponent } from '../../shared';

@Component({
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <app-info-card
        title="Development Team"
        content="team@example.com"
      ></app-info-card>
      
      <app-info-card
        title="Project Repository"
        content="github.com/team/project"
      ></app-info-card>
    </div>
  `
})
export class MyComponent {}
```

### In Component Arrays

```typescript
contactInfo = [
  { title: 'Development Team', content: 'team@example.com' },
  { title: 'Project Repository', content: 'github.com/team/project' },
  { title: 'Support', content: 'support@example.com' }
];
```

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <app-info-card
    *ngFor="let info of contactInfo"
    [title]="info.title"
    [content]="info.content"
  ></app-info-card>
</div>
```

## API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `''` | The card title displayed in bold |
| `content` | `string` | `''` | The main content text displayed below the title |

## Features

- **Responsive Design**: Works well in grid layouts
- **OnPush Change Detection**: Optimized for performance
- **Consistent Styling**: Uses gray background with rounded corners
- **Accessible**: Proper heading structure with semantic HTML

## Used In

- Contact page: Development Team and Project Repository information
- Any component needing card-based information display

## Styling

The component uses Tailwind CSS classes:
- `bg-gray-50 p-4 rounded-lg` for the card container
- `font-semibold text-gray-900 mb-2` for titles
- `text-gray-600` for content text

## Design Guidelines

- Use in grid layouts for optimal presentation
- Keep content concise and scannable
- Group related information together
- Consider responsive breakpoints for grid columns