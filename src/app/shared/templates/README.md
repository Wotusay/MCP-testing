# Component Templates

This directory contains template files for generating new Angular components following the project's conventions and best practices.

## Available Templates

### 1. UI Component Template (`ui-component.template.ts`)
For creating reusable UI components like buttons, cards, badges, etc.

**Features:**
- Extends BaseComponent
- Includes variant and size support
- Click event handling
- Tailwind CSS styling
- Accessibility support

**Usage:**
```bash
node src/app/shared/templates/generate-component.js --name=my-button --type=ui
```

### 2. Feature Component Template (`feature-component.template.ts`)
For creating page/route components with full functionality.

**Features:**
- Extends BaseComponent
- Loading and error states
- Subscription management
- Page layout structure
- Data loading patterns

**Usage:**
```bash
node src/app/shared/templates/generate-component.js --name=user-profile --type=feature
```

### 3. Form Component Template (`form-component.template.ts`)
For creating form input components that work with Angular Forms.

**Features:**
- Implements ControlValueAccessor
- Form validation support
- Accessibility compliance
- Error display
- Help text support

**Usage:**
```bash
node src/app/shared/templates/generate-component.js --name=text-input --type=form
```

## Generator Script

The `generate-component.js` script automates the process of creating new components from these templates.

### Installation

Add this script to your `package.json`:

```json
{
  "scripts": {
    "generate:component": "node src/app/shared/templates/generate-component.js"
  }
}
```

### Usage Examples

```bash
# Generate a UI component
npm run generate:component -- --name=loading-spinner --type=ui

# Generate a feature component
npm run generate:component -- --name=dashboard --type=feature --path=src/app/features

# Generate a form component
npm run generate:component -- --name=email-input --type=form --selector=app-email
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `--name` | Component name (kebab-case) | Yes | - |
| `--type` | Component type (ui\|feature\|form) | Yes | - |
| `--path` | Output directory | No | Based on type |
| `--selector` | Component selector | No | `app-{name}` |

## What Gets Generated

For each component, the generator creates:

1. **Component file** (`{name}.component.ts`) - Main component code
2. **Spec file** (`{name}.component.spec.ts`) - Unit tests
3. **README file** (`README.md`) - Component documentation
4. **Directory structure** - Organized folder structure
5. **Barrel export** - Updates index.ts if present

## Customization

After generating a component:

1. **Update the template** - Modify the HTML template for your needs
2. **Add specific logic** - Implement component-specific functionality
3. **Update styles** - Add custom Tailwind classes or styles
4. **Write tests** - Add comprehensive test cases
5. **Update documentation** - Keep the README current

## Best Practices

1. **Use meaningful names** - Choose descriptive component names
2. **Follow conventions** - Use kebab-case for names
3. **Write tests** - Always add comprehensive tests
4. **Document well** - Keep README files updated
5. **Follow patterns** - Stick to the established patterns

## Template Structure

Each template follows this structure:

```typescript
import { Component, ... } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-SELECTOR_NAME',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
export class COMPONENT_NAMEComponent extends BaseComponent {
  // Component implementation
}
```

## Integration with BaseComponent

All templates extend `BaseComponent` which provides:

- **Subscription management** - Automatic cleanup with `destroy$`
- **Loading states** - Built-in loading property and styling
- **Error handling** - Common error display patterns
- **Accessibility** - ARIA attributes and keyboard navigation
- **Styling utilities** - Common CSS class helpers

This ensures consistency across all components and reduces boilerplate code.