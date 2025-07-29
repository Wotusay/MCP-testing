# Design System Documentation

## Overview

The Angular Team Project now includes a comprehensive design system built on top of Tailwind CSS with SCSS variables and mixins. This system provides consistent styling, theme switching capabilities, and responsive design utilities.

## Features

- ✅ **Comprehensive Design Tokens**: Colors, typography, spacing, and more
- ✅ **Theme Switching**: Light/Dark mode with auto system preference detection
- ✅ **SCSS Variables & Mixins**: Powerful styling utilities and functions
- ✅ **Responsive Design**: Breakpoint utilities and responsive mixins
- ✅ **Extended Tailwind Config**: Custom colors, animations, and utilities
- ✅ **Accessibility**: Focus rings and screen reader utilities
- ✅ **Theme-aware Components**: Seamless transitions between themes

## Getting Started

### Using Design Tokens

The design system provides access to all design tokens through SCSS variables and functions:

```scss
// Using color function
.my-component {
  background-color: color(primary, 600);
  color: color(neutral, 100);
}

// Using spacing
.my-component {
  @include spacing(padding, 4);
  @include spacing(margin-bottom, 6);
}

// Using typography
.my-heading {
  @include typography(xl, bold, sans);
}
```

### Responsive Design

Use responsive mixins for breakpoint-based styling:

```scss
.my-component {
  @include responsive-font(base, lg, md);
  
  @include breakpoint(lg) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Theme Support

Components automatically support theme switching through CSS custom properties:

```scss
.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}
```

## Components

### ThemeToggleComponent

A ready-to-use theme toggle button that switches between light and dark modes.

```html
<app-theme-toggle></app-theme-toggle>
```

**Features:**
- Animated sun/moon icons
- Accessibility support with ARIA labels
- Smooth transitions
- System preference detection

### Using the Theme Service

```typescript
import { ThemeService } from './shared/services/theme.service';

@Component({...})
export class MyComponent {
  private themeService = inject(ThemeService);
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  get isDark() {
    return this.themeService.isDark();
  }
}
```

## Tailwind Extensions

The system extends Tailwind with custom utilities:

```html
<!-- Theme-aware backgrounds -->
<div class="bg-theme-primary">
  <h1 class="text-theme-primary">Hello World</h1>
</div>

<!-- Custom animations -->
<div class="animate-fade-in">Fade in animation</div>

<!-- Custom shadows -->
<div class="shadow-glow">Glowing shadow</div>
```

## Available Mixins

### Layout Mixins
- `@mixin flex-center` - Center content with flexbox
- `@mixin grid-responsive($mobile, $tablet, $desktop)` - Responsive grid
- `@mixin component-spacing($size)` - Consistent component spacing

### Typography Mixins
- `@mixin typography($size, $weight, $family)` - Complete typography styles
- `@mixin responsive-font($mobile, $desktop, $breakpoint)` - Responsive typography

### Component Mixins
- `@mixin card($theme)` - Card styling with theme support
- `@mixin button-base()` - Base button styles
- `@mixin button-variant($color)` - Button color variants
- `@mixin input-field($theme)` - Form input styling

### Utility Mixins
- `@mixin theme-transition($properties)` - Smooth theme transitions
- `@mixin truncate` - Text truncation with ellipsis
- `@mixin sr-only` - Screen reader only content
- `@mixin focus-ring($color)` - Accessibility focus rings

## Color Palette

The design system includes comprehensive color scales:

- **Primary**: Blue scale (50-950)
- **Secondary**: Slate scale (50-950)  
- **Success**: Green scale (50-950)
- **Warning**: Amber scale (50-950)
- **Danger**: Red scale (50-950)
- **Neutral**: Gray scale (0, 50-950)

## Typography Scale

Typography follows a consistent scale with proper line heights:

- **xs**: 12px / 16px
- **sm**: 14px / 20px
- **base**: 16px / 24px
- **lg**: 18px / 28px
- **xl**: 20px / 28px
- **2xl**: 24px / 32px
- **3xl**: 30px / 36px
- **4xl**: 36px / 40px
- **5xl**: 48px / 1
- **6xl**: 60px / 1
- **7xl**: 72px / 1
- **8xl**: 96px / 1
- **9xl**: 128px / 1

## Breakpoints

Responsive design follows standard breakpoints:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Best Practices

1. **Use Design Tokens**: Always use the provided color and spacing functions instead of hardcoded values
2. **Theme-Aware Styling**: Use CSS custom properties for theme-aware components
3. **Responsive Design**: Use responsive mixins for consistent breakpoint handling
4. **Accessibility**: Include focus rings and proper ARIA labels
5. **Performance**: Use OnPush change detection and avoid expensive operations in templates

## Migration from CSS

If migrating existing CSS to the design system:

1. Replace hardcoded colors with `color()` function calls
2. Replace hardcoded spacing with `spacing()` mixin
3. Add theme support using CSS custom properties
4. Use responsive mixins instead of manual media queries
5. Apply consistent component mixins for cards, buttons, etc.

## Contributing

When adding new components or modifying the design system:

1. Follow the established patterns in `_variables.scss` and `_mixins.scss`
2. Add theme support for any color-based properties
3. Include responsive design considerations
4. Write tests for new components
5. Update this documentation

## Performance Considerations

The design system is optimized for performance:

- CSS custom properties enable efficient theme switching
- SCSS compilation reduces runtime overhead
- Tailwind purging removes unused styles
- Smooth transitions are hardware-accelerated
- OnPush change detection minimizes re-renders