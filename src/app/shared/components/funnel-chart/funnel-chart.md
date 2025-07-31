# Funnel Chart Component

A reusable pie chart component for displaying funnel data with percentages.

## Usage

```typescript
import { FunnelChartComponent } from '@shared/components/funnel-chart';

// In your component template
<app-funnel-chart 
  [data]="funnelData"
  title="Client Journey Funnel">
</app-funnel-chart>
```

## Input Properties

- `data` (FunnelData[]): Array of funnel segments with labels, values, percentages and colors
- `title` (string): Chart title (default: 'Client Journey Funnel')

## Features

- SVG-based pie chart
- Interactive hover effects
- Color-coded legend with percentages
- Responsive design with dark mode support
- Automatic arc path calculation