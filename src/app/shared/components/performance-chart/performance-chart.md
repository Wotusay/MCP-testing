# Performance Chart Component

A reusable bar chart component for displaying dual-metric performance data.

## Usage

```typescript
import { PerformanceChartComponent } from '@shared/components/performance-chart';

// In your component template
<app-performance-chart 
  [data]="performanceData"
  title="Weekly Outreach Performance"
  primaryLabel="Outreach Attempts"
  secondaryLabel="Responses">
</app-performance-chart>
```

## Input Properties

- `data` (PerformanceData[]): Array of performance data points
- `title` (string): Chart title (default: 'Weekly Outreach Performance')
- `primaryLabel` (string): Label for primary metric (default: 'Outreach Attempts')
- `secondaryLabel` (string): Label for secondary metric (default: 'Responses')

## Features

- Interactive hover tooltips
- Responsive design with dark mode support
- Dual-bar visualization
- Automatic scaling based on data
- Color-coded legend