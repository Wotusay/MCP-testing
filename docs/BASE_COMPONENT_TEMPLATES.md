# Base Component Templates

This documentation provides a comprehensive guide to the base component templates system implemented in this Angular project.

## Overview

The base component templates system provides:
- **BaseComponent**: Abstract class with common functionality
- **Component Interfaces**: TypeScript interfaces for consistent component APIs
- **Template Files**: Scaffold files for different component types
- **Generator Script**: Automated component creation tool

## 🏗️ Architecture

### BaseComponent Class

Located at `src/app/shared/base/base.component.ts`

**Features:**
- Automatic subscription cleanup with `destroy$` subject
- Loading state management
- Error handling utilities
- Accessibility support
- Common CSS class helpers

**Key Methods:**
```typescript
protected setError(error: string | Error | null): void
protected clearError(): void
protected hasError(): boolean
protected getComponentClasses(): string
protected getAccessibilityAttributes(): Record<string, string | undefined>
```

### Component Interfaces

Located at `src/app/shared/base/component.interfaces.ts`

**Common Types:**
- `ColorVariant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
- `SizeVariant`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `StatusType`: 'success' | 'error' | 'warning' | 'info' | 'pending'

**Interfaces:**
- `BaseComponentProps`: Base properties for all components
- `VariantComponent`: Components with color/size variants
- `FormInputComponent`: Form input components
- `StatusComponent`: Status display components
- `CardComponent`: Card-like components
- `ModalComponent`: Modal/dialog components
- `ListComponent<T>`: List display components
- `TableComponent<T>`: Data table components

## 📁 Template Types

### 1. UI Component Template

**File:** `src/app/shared/templates/ui-component.template.ts`

**Best for:**
- Buttons, badges, icons
- Cards, modals, tooltips
- Interactive UI elements

**Features:**
- Variant and size support
- Click event handling
- Loading and disabled states
- Accessibility compliance

**Example Usage:**
```bash
npm run generate:component -- --name=loading-button --type=ui
```

### 2. Feature Component Template

**File:** `src/app/shared/templates/feature-component.template.ts`

**Best for:**
- Page components
- Route components
- Container components

**Features:**
- OnInit lifecycle hook
- Data loading patterns
- Error handling UI
- Loading state UI
- Page layout structure

**Example Usage:**
```bash
npm run generate:component -- --name=user-dashboard --type=feature --path=src/app/features
```

### 3. Form Component Template

**File:** `src/app/shared/templates/form-component.template.ts`

**Best for:**
- Input fields
- Form controls
- Custom form elements

**Features:**
- ControlValueAccessor implementation
- Form validation support
- Label and help text
- Error display
- Accessibility compliance

**Example Usage:**
```bash
npm run generate:component -- --name=email-input --type=form
```

## 🤖 Generator Script

### Installation

The generator script is already configured in `package.json`:

```json
{
  "scripts": {
    "generate:component": "node src/app/shared/templates/generate-component.js"
  }
}
```

### Usage

```bash
npm run generate:component -- --name=COMPONENT_NAME --type=TYPE [--path=PATH] [--selector=SELECTOR]
```

### Options

| Option | Required | Description | Example |
|--------|----------|-------------|---------|
| `--name` | Yes | Component name (kebab-case) | `user-profile` |
| `--type` | Yes | Template type (ui\|feature\|form) | `ui` |
| `--path` | No | Output directory | `src/app/shared/components` |
| `--selector` | No | Component selector | `app-user-profile` |

### Generated Files

For each component, the generator creates:

1. **Component file** (`{name}.component.ts`)
2. **Spec file** (`{name}.component.spec.ts`)
3. **README file** (`README.md`)
4. **Directory structure**
5. **Barrel export** (updates `index.ts`)

## 📝 Usage Examples

### Creating a Loading Spinner

```bash
npm run generate:component -- --name=loading-spinner --type=ui
```

**Generated component:**
```typescript
export class LoadingSpinnerComponent extends BaseComponent implements VariantComponent {
  @Input() variant: ColorVariant = 'primary';
  @Input() size: SizeVariant = 'md';
  @Output() componentClick = new EventEmitter<void>();
  
  // Component implementation...
}
```

### Creating a User Profile Page

```bash
npm run generate:component -- --name=user-profile --type=feature --path=src/app/features
```

**Generated component:**
```typescript
export class UserProfileComponent extends BaseComponent implements OnInit {
  data: unknown[] = [];
  
  ngOnInit(): void {
    this.loadData();
  }
  
  // Component implementation...
}
```

### Creating a Search Input

```bash
npm run generate:component -- --name=search-input --type=form
```

**Generated component:**
```typescript
export class SearchInputComponent extends BaseComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Search...';
  @Output() valueChange = new EventEmitter<unknown>();
  
  // ControlValueAccessor implementation...
}
```

## 🎯 Best Practices

### 1. Component Naming
- Use kebab-case for component names
- Be descriptive and specific
- Follow Angular naming conventions

```bash
✅ npm run generate:component -- --name=user-avatar --type=ui
❌ npm run generate:component -- --name=Avatar --type=ui
```

### 2. Template Customization
After generation, customize:
- Update the template HTML
- Add component-specific properties
- Implement business logic
- Add comprehensive tests
- Update documentation

### 3. Error Handling
Utilize BaseComponent error methods:

```typescript
// In your component method
try {
  await this.dataService.loadData();
} catch (error) {
  this.setError(error);
}
```

### 4. Loading States
Use built-in loading management:

```typescript
async loadData(): Promise<void> {
  this.loading = true;
  try {
    this.data = await this.service.getData();
  } finally {
    this.loading = false;
  }
}
```

### 5. Accessibility
Leverage BaseComponent accessibility helpers:

```typescript
get accessibilityAttrs() {
  return {
    ...this.getAccessibilityAttributes(),
    'aria-expanded': this.isExpanded,
  };
}
```

## 🔧 Customization

### Extending Templates

To create custom templates:

1. Copy existing template to new file
2. Modify the template structure
3. Update the generator script mapping
4. Test with the generator

### Adding New Interfaces

1. Add interface to `component.interfaces.ts`
2. Export from `base/index.ts`
3. Update templates to use interface
4. Update documentation

### Custom Base Classes

You can create specialized base classes:

```typescript
// src/app/shared/base/form-base.component.ts
export abstract class FormBaseComponent extends BaseComponent {
  // Form-specific functionality
}
```

## 🧪 Testing

### Generated Tests

Each generated component includes:
- Basic creation test
- Default property tests
- Type-specific tests (click events, form handling, etc.)

### Testing BaseComponent

```typescript
it('should handle errors correctly', () => {
  component.setError('Test error');
  expect(component.hasError()).toBeTruthy();
  
  component.clearError();
  expect(component.hasError()).toBeFalsy();
});
```

## 🚀 Migration Guide

### Existing Components

To migrate existing components to use BaseComponent:

1. **Import BaseComponent:**
```typescript
import { BaseComponent } from '../../shared/base/base.component';
```

2. **Extend BaseComponent:**
```typescript
export class ExistingComponent extends BaseComponent {
  // Your existing code...
}
```

3. **Update template to use base functionality:**
```html
<div [class]="getComponentClasses()">
  <!-- Your template -->
  @if (hasError()) {
    <div class="error">{{ error }}</div>
  }
</div>
```

4. **Implement OnDestroy (if not already):**
```typescript
// BaseComponent handles this automatically
// Remove manual subscription cleanup
```

## 📊 Performance Considerations

### BaseComponent Benefits
- **Reduced bundle size**: Shared functionality
- **Consistent patterns**: Easier optimization
- **Automatic cleanup**: Prevents memory leaks
- **OnPush compatibility**: All templates use OnPush

### Best Practices
- Use OnPush change detection (default in templates)
- Leverage shared CSS classes
- Minimize template complexity
- Use trackBy functions for lists

## 🐛 Troubleshooting

### Common Issues

**Issue**: Generator script not found
```bash
Error: Cannot find module 'src/app/shared/templates/generate-component.js'
```
**Solution**: Ensure you're running from project root directory

**Issue**: Import path errors in generated component
```typescript
Cannot find module '../../base/base.component'
```
**Solution**: Generator automatically calculates correct paths

**Issue**: ESLint errors in templates
**Solution**: Templates are pre-configured with ESLint compliance

### Debug Mode

Run generator with verbose output:
```bash
# Add debug logging to generator script
node src/app/shared/templates/generate-component.js --name=test --type=ui --debug
```

## 📚 Additional Resources

- [Angular Component Guide](https://angular.dev/guide/components)
- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

To contribute to the base templates system:

1. Follow existing patterns and conventions
2. Add comprehensive tests
3. Update documentation
4. Ensure ESLint compliance
5. Test with the generator script

## 📞 Support

For questions or issues with the base templates system:
- Create an issue in the project repository
- Check existing documentation
- Review generated component examples