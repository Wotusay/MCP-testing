# MetricsBox Component

A reusable component for displaying metrics, alerts, and informational content in styled containers.

## Purpose

The MetricsBox component provides a consistent way to display important information, metrics, alerts, and status messages with appropriate visual styling based on the content type.

## Usage

### Basic Usage

```typescript
import { MetricsBoxComponent } from '../../shared';

@Component({
  template: `
    <app-metrics-box
      title="Performance Metrics"
      variant="info"
    >
      This page loads with lazy loading and OnPush change detection for optimal performance.
      Load time: {{ loadTime() }}ms
    </app-metrics-box>
  `
})
export class MyComponent {}
```

### Different Variants

```html
<!-- Information (default) -->
<app-metrics-box title="System Info" variant="info">
  Application is running optimally.
</app-metrics-box>

<!-- Success -->
<app-metrics-box title="Success" variant="success">
  All tests passed successfully!
</app-metrics-box>

<!-- Warning -->
<app-metrics-box title="Notice" variant="warning">
  Performance budget is approaching limit.
</app-metrics-box>

<!-- Error -->
<app-metrics-box title="Error" variant="error">
  Build failed with compilation errors.
</app-metrics-box>
```

### With Dynamic Content

```typescript
@Component({
  template: `
    <app-metrics-box
      title="Load Time Metrics"
      variant="info"
    >
      <div>
        <p>Component load time: {{ loadTime() }}ms</p>
        <p>Bundle size: {{ bundleSize }}KB</p>
        <p>Cache status: {{ cacheStatus }}</p>
      </div>
    </app-metrics-box>
  `
})
export class PerformanceComponent {
  loadTime = signal(0);
  bundleSize = 256;
  cacheStatus = 'Active';
}
```

## API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `''` | The box title displayed in bold |
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Visual style variant |

### Content Projection

The component uses `<ng-content>` to project custom content, allowing for:
- Plain text
- HTML content
- Angular components
- Dynamic data binding

## Variants

### Info (Blue)
- Background: `bg-blue-50`
- Border: `border-blue-200`
- Title: `text-blue-900`
- Content: `text-blue-800`

### Success (Green)
- Background: `bg-green-50`
- Border: `border-green-200`
- Title: `text-green-900`
- Content: `text-green-800`

### Warning (Yellow)
- Background: `bg-yellow-50`
- Border: `border-yellow-200`
- Title: `text-yellow-900`
- Content: `text-yellow-800`

### Error (Red)
- Background: `bg-red-50`
- Border: `border-red-200`
- Title: `text-red-900`
- Content: `text-red-800`

## Features

- **Visual Hierarchy**: Clear title and content separation
- **OnPush Change Detection**: Optimized for performance
- **Content Projection**: Flexible content through ng-content
- **Responsive Design**: Works across different screen sizes
- **Accessible**: Semantic HTML structure

## Used In

- Contact page: Performance metrics display
- Error pages: Error messages and status
- Dashboard: System status and metrics
- Any component needing highlighted information boxes

## Best Practices

- Choose appropriate variant based on message type
- Keep titles concise and descriptive
- Use for important information that needs visual emphasis
- Consider grouping related metrics in the same variant type