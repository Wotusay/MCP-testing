# Shared Components Library

A collection of reusable Angular components built with Tailwind CSS for consistent UI development.

## Overview

This library provides a set of standalone Angular components that can be easily imported and used throughout the application. All components are built with Tailwind CSS and follow modern Angular patterns.

## Available Components

### 1. StatusBadgeComponent
**Purpose**: Display status information with colored badges  
**File**: `status-badge.component.ts`  
**Documentation**: [status-badge.md](./components/status-badge.md)

```typescript
import { StatusBadgeComponent } from './shared';
```

### 2. FeatureCardComponent  
**Purpose**: Display features with icons, titles, and descriptions  
**File**: `feature-card.component.ts`  
**Documentation**: [feature-card.md](./components/feature-card.md)

```typescript
import { FeatureCardComponent } from './shared';
```

### 3. StatusIndicatorComponent
**Purpose**: Show status with colored dots and text  
**File**: `status-indicator.component.ts`  
**Documentation**: [status-indicator.md](./components/status-indicator.md)

```typescript
import { StatusIndicatorComponent } from './shared';
```

### 4. ButtonComponent
**Purpose**: Reusable button with variants, sizes, and events  
**File**: `button.component.ts`  
**Documentation**: [button.md](./components/button.md)

```typescript
import { ButtonComponent } from './shared';
```

## Installation & Usage

### Step 1: Import Components

```typescript
// In your component file
import { 
  StatusBadgeComponent,
  FeatureCardComponent, 
  StatusIndicatorComponent,
  ButtonComponent 
} from './shared';

@Component({
  selector: 'app-example',
  imports: [
    StatusBadgeComponent,
    FeatureCardComponent,
    StatusIndicatorComponent,
    ButtonComponent
  ],
  // ... rest of component
})
```

### Step 2: Use in Templates

```html
<!-- Status Badge -->
<app-status-badge text="Active" variant="success"></app-status-badge>

<!-- Feature Card -->
<app-feature-card
  title="Angular"
  description="Modern web framework"
  iconPath="M12 2L2 7v10c0 5.55 3.84 12 9 12s9-6.45 9-12V7l-10-5z"
  iconColor="red">
</app-feature-card>

<!-- Status Indicator -->
<app-status-indicator text="Server Running" status="success"></app-status-indicator>

<!-- Button -->
<app-button 
  text="Click Me" 
  variant="primary" 
  (buttonClick)="handleClick()">
</app-button>
```

## Design Principles

### Consistency
- All components use Tailwind CSS for styling
- Consistent color schemes across components
- Standardized spacing and typography

### Reusability
- Standalone components that don't depend on each other
- Configurable through inputs
- Composable for complex layouts

### Accessibility
- Semantic HTML elements
- Proper ARIA attributes where needed
- Keyboard navigation support
- Color contrast compliance

### Performance
- Standalone components for tree-shaking
- Minimal dependencies
- Optimized for Angular's change detection

## Component Architecture

```
src/app/shared/
├── components/
│   ├── status-badge.component.ts
│   ├── status-badge.md
│   ├── feature-card.component.ts
│   ├── feature-card.md
│   ├── status-indicator.component.ts
│   ├── status-indicator.md
│   ├── button.component.ts
│   └── button.md
├── index.ts (barrel exports)
└── README.md (this file)
```

## Contributing

When adding new components to this library:

1. **Create the component** in `src/app/shared/components/`
2. **Make it standalone** with proper imports
3. **Add TypeScript interfaces** for props and types
4. **Create documentation** with usage examples
5. **Export from index.ts** for easy importing
6. **Update this README** with the new component
7. **Follow ESLint/Prettier** rules for code consistency

## Best Practices

### Component Design
- Keep components small and focused
- Use proper TypeScript types
- Implement proper event handling
- Add input validation where needed

### Styling
- Use Tailwind utility classes
- Create computed properties for dynamic classes
- Maintain consistent spacing and colors
- Support responsive design

### Documentation
- Include usage examples
- Document all inputs and outputs
- Show different variants/states
- Explain common use cases

## Future Enhancements

- Add unit tests for all components
- Create Storybook documentation
- Add animation/transition components  
- Implement form input components
- Add modal/dialog components
- Create navigation components
