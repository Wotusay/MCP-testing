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

The design system includes comprehensive color scales with proper semantic meaning and accessibility considerations:

### Primary Colors (Blue Scale)
Used for primary actions, links, and brand elements.

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50    | #eff6ff  | Very light backgrounds |
| 100   | #dbeafe  | Light backgrounds |
| 200   | #bfdbfe  | Subtle borders |
| 300   | #93c5fd  | Disabled elements |
| 400   | #60a5fa  | Hover states |
| 500   | #3b82f6  | **Primary brand color** |
| 600   | #2563eb  | Active states |
| 700   | #1d4ed8  | Dark accents |
| 800   | #1e40af  | Strong emphasis |
| 900   | #1e3a8a  | Dark backgrounds |
| 950   | #172554  | Darkest elements |

### Secondary Colors (Slate Scale)
Used for text, backgrounds, and neutral elements.

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50    | #f8fafc  | Light backgrounds |
| 100   | #f1f5f9  | Subtle backgrounds |
| 200   | #e2e8f0  | Borders |
| 300   | #cbd5e1  | Placeholder text |
| 400   | #94a3b8  | Disabled text |
| 500   | #64748b  | Secondary text |
| 600   | #475569  | Body text |
| 700   | #334155  | Headings (light mode) |
| 800   | #1e293b  | Dark backgrounds |
| 900   | #0f172a  | Darkest backgrounds |
| 950   | #020617  | Pure dark |

### Semantic Colors

#### Success (Green Scale)
- **50**: #f0fdf4 - Lightest success backgrounds
- **100**: #dcfce7 - Light success backgrounds
- **200**: #bbf7d0 - Success borders
- **300**: #86efac - Success accents
- **400**: #4ade80 - Success hover states
- **500**: #22c55e - **Primary success color**
- **600**: #16a34a - Success active states
- **700**: #15803d - Dark success elements
- **800**: #166534 - Strong success emphasis
- **900**: #14532d - Darkest success elements
- **950**: #052e16 - Pure dark success

#### Warning (Amber Scale)
- **50**: #fffbeb - Lightest warning backgrounds
- **100**: #fef3c7 - Light warning backgrounds
- **200**: #fde68a - Warning borders
- **300**: #fcd34d - Warning accents
- **400**: #fbbf24 - Warning hover states
- **500**: #f59e0b - **Primary warning color**
- **600**: #d97706 - Warning active states
- **700**: #b45309 - Dark warning elements
- **800**: #92400e - Strong warning emphasis
- **900**: #78350f - Darkest warning elements
- **950**: #451a03 - Pure dark warning

#### Danger (Red Scale)
- **50**: #fef2f2 - Lightest error backgrounds
- **100**: #fee2e2 - Light error backgrounds
- **200**: #fecaca - Error borders
- **300**: #fca5a5 - Error accents
- **400**: #f87171 - Error hover states
- **500**: #ef4444 - **Primary error color**
- **600**: #dc2626 - Error active states
- **700**: #b91c1c - Dark error elements
- **800**: #991b1b - Strong error emphasis
- **900**: #7f1d1d - Darkest error elements
- **950**: #450a0a - Pure dark error

## Typography Scale

The typography system provides a comprehensive scale with proper line heights, letter spacing, and semantic classes for optimal readability and hierarchy.

### Display Sizes
Large text for hero sections and major headings.

| Class | Size | Line Height | Letter Spacing | Font Weight | Usage |
|-------|------|-------------|----------------|-------------|-------|
| `.text-display-2xl` | 72px (4.5rem) | 1.1 | -0.02em | 800 | Hero headlines |
| `.text-display-xl` | 60px (3.75rem) | 1.1 | -0.02em | 800 | Large headlines |
| `.text-display-lg` | 48px (3rem) | 1.125 | -0.015em | 700 | Section heroes |

### Semantic Headings
Consistent heading styles for content hierarchy.

| Class | Size | Line Height | Letter Spacing | Font Weight | HTML Tag |
|-------|------|-------------|----------------|-------------|----------|
| `.text-h1` | 36px (2.25rem) | 1.2 | -0.01em | 700 | `<h1>` |
| `.text-h2` | 30px (1.875rem) | 1.25 | -0.01em | 600 | `<h2>` |
| `.text-h3` | 24px (1.5rem) | 1.3 | -0.005em | 600 | `<h3>` |
| `.text-h4` | 20px (1.25rem) | 1.4 | 0 | 600 | `<h4>` |
| `.text-h5` | 18px (1.125rem) | 1.4 | 0 | 600 | `<h5>` |

### Body Text
Content text optimized for readability.

| Class | Size | Line Height | Letter Spacing | Font Weight | Usage |
|-------|------|-------------|----------------|-------------|-------|
| `.text-body-xl` | 18px (1.125rem) | 1.6 | 0 | 400 | Lead paragraphs |
| `.text-body-lg` | 16px (1rem) | 1.6 | 0 | 400 | **Default body text** |
| `.text-body-md` | 14px (0.875rem) | 1.5 | 0 | 400 | Secondary content |
| `.text-body-sm` | 12px (0.75rem) | 1.5 | 0.01em | 400 | Small text |

### Specialized Text
Special purpose text styles.

| Class | Size | Line Height | Letter Spacing | Font Weight | Usage |
|-------|------|-------------|----------------|-------------|-------|
| `.text-caption` | 11px (0.6875rem) | 1.4 | 0.01em | 400 | Captions, metadata |
| `.text-overline` | 10px (0.625rem) | 1.2 | 0.08em | 600 | Labels, categories |

### Extended Typography Scale (Tailwind Custom Sizes)
Additional sizes available in tailwind.config.js:

- **heading-xl**: 36px / 1.2 / -0.01em / 700
- **heading-lg**: 30px / 1.25 / -0.01em / 600  
- **heading-md**: 24px / 1.3 / -0.005em / 600
- **heading-sm**: 20px / 1.4 / 0 / 600
- **heading-xs**: 18px / 1.4 / 0 / 600
- **body-xl**: 18px / 1.6 / 0 / 400
- **body-lg**: 16px / 1.6 / 0 / 400
- **body-md**: 14px / 1.5 / 0 / 400
- **body-sm**: 12px / 1.5 / 0.01em / 400
- **caption**: 11px / 1.4 / 0.01em / 400
- **overline**: 10px / 1.2 / 0.08em / 600

### Typography Utility Classes

#### Semantic Classes
- `.text-link` - Styled links with hover effects and transitions
- `.text-emphasis` - Bold text for emphasis
- `.text-muted` - Subdued text for less important content

#### Status Text
- `.text-success` - Success messages and indicators (green)
- `.text-warning` - Warning messages and indicators (amber)
- `.text-danger` - Error messages and indicators (red)

#### Utility Classes
- `.text-truncate` - Single line text truncation with ellipsis
- `.text-truncate-2` - Two line text truncation
- `.text-truncate-3` - Three line text truncation
- `.text-balance` - Balanced text wrapping for better typography
- `.select-none` - Prevent text selection

### Enhanced Letter Spacing Scale
- **tightest**: -0.02em
- **tighter**: -0.015em
- **tight**: -0.01em
- **slightly-tight**: -0.005em
- **normal**: 0
- **wide**: 0.01em
- **wider**: 0.05em
- **widest**: 0.08em

### Enhanced Line Height Scale
- **none**: 1
- **tight**: 1.1
- **snug**: 1.2
- **normal**: 1.5
- **relaxed**: 1.6
- **loose**: 1.8
- **extra-loose**: 2.0

## Breakpoints

Responsive design follows standard breakpoints:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Live Typography & Color Showcase

Visit `/design-system` in the application to see a comprehensive showcase of all typography styles and color palettes in action. The showcase includes:

- **Display text examples** - Hero headlines and large headings
- **Semantic heading hierarchy** - H1 through H5 examples
- **Body text variations** - Different sizes for various content types
- **Specialized text styles** - Links, emphasis, captions, and status messages
- **Complete color palettes** - All color scales with hex values
- **Dark mode support** - Toggle between light and dark themes to see adaptive colors

## Usage Examples

### HTML Usage
```html
<!-- Display text for heroes -->
<h1 class="text-display-lg">Hero Headline</h1>

<!-- Semantic headings -->
<h2 class="text-h2">Section Title</h2>
<h3 class="text-h3">Subsection Title</h3>

<!-- Body text variations -->
<p class="text-body-xl">Lead paragraph with larger text for emphasis.</p>
<p class="text-body-lg">Default paragraph text for optimal readability.</p>
<p class="text-body-sm text-muted">Secondary information in smaller text.</p>

<!-- Links and emphasis -->
<a href="#" class="text-link">Styled link with hover effects</a>
<span class="text-emphasis">Important information</span>

<!-- Status text -->
<p class="text-success">✓ Operation completed successfully</p>
<p class="text-warning">⚠ Please review your input</p>
<p class="text-danger">✗ An error occurred</p>

<!-- Specialized text -->
<p class="text-overline">Form Section</p>
<p class="text-caption">Additional context or metadata</p>
```

### Tailwind CSS Direct Usage
```html
<!-- Using extended font sizes -->
<p class="text-heading-lg font-semibold tracking-tight">Custom heading</p>
<p class="text-body-md leading-normal">Custom body text</p>

<!-- Color combinations -->
<div class="bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
  Themed primary content
</div>

<div class="bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
  Success notification
</div>
```

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