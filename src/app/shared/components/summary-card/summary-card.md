# Summary Card Component

A reusable component for displaying summary metrics with icons and change indicators.

## Usage

```typescript
import { SummaryCardComponent } from '@shared/components/summary-card';

// In your component template
<app-summary-card [card]="summaryCardData"></app-summary-card>
```

## Input Properties

- `card` (SummaryCard): The summary card data containing title, value, change info and icon

## Features

- Responsive design with dark mode support
- Change indicators with positive/negative styling
- SVG icon support
- Consistent styling with design system