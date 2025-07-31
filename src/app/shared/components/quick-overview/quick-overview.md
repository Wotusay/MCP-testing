# Quick Overview Component

A reusable component for displaying key metrics in a 4-column grid layout.

## Usage

```typescript
import { QuickOverviewComponent } from '@shared/components/quick-overview';

// In your component template
<app-quick-overview 
  [recentOutreach]="recentOutreachData"
  [engagementTypes]="engagementTypesData"
  [todaySchedule]="todayScheduleData"
  [performanceMetrics]="performanceMetricsData">
</app-quick-overview>
```

## Input Properties

- `title` (string): Section title (default: 'Quick Overview')
- `subtitle` (string): Section subtitle (default: 'Key metrics and recent activity summary')
- `recentOutreach` (QuickMetric[]): Recent outreach metrics
- `engagementTypes` (QuickMetric[]): Engagement type metrics
- `todaySchedule` (QuickMetric[]): Today's schedule metrics
- `performanceMetrics` (QuickMetric[]): Performance metrics
- Column titles can be customized via individual title inputs

## Features

- Responsive 4-column grid layout
- Status badges with color coding
- Dark mode support
- Flexible metric display