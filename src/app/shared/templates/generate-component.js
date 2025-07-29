#!/usr/bin/env node

/**
 * Component Generator Script
 * 
 * Generates new Angular components based on the project's base templates.
 * 
 * Usage:
 *   npm run generate:component -- --name=my-component --type=ui --path=src/app/shared/components
 *   npm run generate:component -- --name=user-profile --type=feature --path=src/app/features
 *   npm run generate:component -- --name=text-input --type=form --path=src/app/shared/components
 * 
 * Options:
 *   --name: Component name (kebab-case)
 *   --type: Component type (ui|feature|form)
 *   --path: Output path (optional, defaults based on type)
 *   --selector: Custom selector (optional, defaults to app-{name})
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.slice(2).split('=');
    options[key] = value;
  }
});

// Validate required options
if (!options.name) {
  console.error('Error: --name is required');
  console.log('Usage: npm run generate:component -- --name=my-component --type=ui');
  process.exit(1);
}

if (!options.type) {
  console.error('Error: --type is required (ui|feature|form)');
  process.exit(1);
}

const validTypes = ['ui', 'feature', 'form'];
if (!validTypes.includes(options.type)) {
  console.error(`Error: --type must be one of: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Component configuration
const componentName = options.name;
const componentType = options.type;
const className = toPascalCase(componentName) + 'Component';
const selector = options.selector || `app-${componentName}`;

// Default paths based on component type
const defaultPaths = {
  ui: 'src/app/shared/components',
  feature: 'src/app/features',
  form: 'src/app/shared/components'
};

const outputPath = options.path || defaultPaths[componentType];
const componentDir = path.join(outputPath, componentName);

// Template mappings
const templateFiles = {
  ui: 'ui-component.template.ts',
  feature: 'feature-component.template.ts',
  form: 'form-component.template.ts'
};

const templateFile = templateFiles[componentType];
const templatePath = path.join('src/app/shared/templates', templateFile);

/**
 * Get correct import path for base classes based on component location
 */
function getImportPath(componentPath, targetFile) {
  const relativePath = path.relative(componentPath, 'src/app/shared/base');
  return path.join(relativePath, targetFile).replace(/\\/g, '/');
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Create component directory
 */
function createComponentDirectory() {
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
    console.log(`✓ Created directory: ${componentDir}`);
  } else {
    console.log(`✓ Directory already exists: ${componentDir}`);
  }
}

/**
 * Generate component file from template
 */
function generateComponentFile() {
  // Read template file
  if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file not found: ${templatePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(templatePath, 'utf8');

  // Calculate correct import paths
  const baseComponentPath = getImportPath(componentDir, 'base.component');
  const interfacesPath = getImportPath(componentDir, 'component.interfaces');

  // Replace placeholders
  content = content.replace(/COMPONENT_NAME/g, className.replace('Component', ''));
  content = content.replace(/SELECTOR_NAME/g, componentName);
  content = content.replace(/app-component-name/g, selector);
  
  // Fix import paths
  content = content.replace(/from '.*\/base\/base\.component'/g, `from '${baseComponentPath}'`);
  content = content.replace(/from '.*\/base\/component\.interfaces'/g, `from '${interfacesPath}'`);

  // Write component file
  const componentFilePath = path.join(componentDir, `${componentName}.component.ts`);
  fs.writeFileSync(componentFilePath, content);
  
  console.log(`✓ Generated component: ${componentFilePath}`);
}

/**
 * Generate spec file
 */
function generateSpecFile() {
  const specContent = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${className} } from './${componentName}.component';

describe('${className}', () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${className}],
    }).compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default properties', () => {
    expect(component.disabled).toBeFalse();
    expect(component.loading).toBeFalse();
  });

  ${componentType === 'ui' ? `
  it('should emit click event when clicked', () => {
    spyOn(component.componentClick, 'emit');
    component.onClick();
    expect(component.componentClick.emit).toHaveBeenCalled();
  });
  ` : ''}

  ${componentType === 'form' ? `
  it('should update value when input changes', () => {
    const testValue = 'test value';
    component.writeValue(testValue);
    expect(component.value).toBe(testValue);
  });

  it('should call onChange when value changes', () => {
    const mockOnChange = jasmine.createSpy('onChange');
    component.registerOnChange(mockOnChange);
    
    const mockEvent = { target: { value: 'new value' } } as any;
    component.onInput(mockEvent);
    
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });
  ` : ''}
});`;

  const specFilePath = path.join(componentDir, `${componentName}.component.spec.ts`);
  fs.writeFileSync(specFilePath, specContent);
  
  console.log(`✓ Generated spec file: ${specFilePath}`);
}

/**
 * Generate README file
 */
function generateReadmeFile() {
  const readmeContent = `# ${className}

## Description
${componentType === 'ui' ? 'A reusable UI component' : componentType === 'feature' ? 'A feature component (page/route)' : 'A form input component'} created from the project template.

## Usage

\`\`\`typescript
import { ${className} } from './${componentName}.component';

@Component({
  imports: [${className}],
  // ...
})
export class MyComponent {
  // ...
}
\`\`\`

\`\`\`html
<${selector}${componentType === 'ui' ? ` variant="primary" size="md"` : componentType === 'form' ? ` label="Label" placeholder="Enter value"` : ''}></${selector}>
\`\`\`

## Properties

${componentType === 'ui' ? `
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | ColorVariant | 'primary' | Color variant |
| size | SizeVariant | 'md' | Size variant |
| disabled | boolean | false | Disabled state |
| loading | boolean | false | Loading state |
` : componentType === 'form' ? `
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| label | string | undefined | Input label |
| placeholder | string | '' | Placeholder text |
| required | boolean | false | Required field |
| disabled | boolean | false | Disabled state |
| readonly | boolean | false | Readonly state |
` : `
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| loading | boolean | false | Loading state |
| disabled | boolean | false | Disabled state |
`}

## Events

${componentType === 'ui' ? `
| Event | Type | Description |
|-------|------|-------------|
| componentClick | void | Emitted when component is clicked |
` : componentType === 'form' ? `
| Event | Type | Description |
|-------|------|-------------|
| valueChange | any | Emitted when value changes |
| inputBlur | void | Emitted when input loses focus |
| inputFocus | void | Emitted when input gains focus |
` : ''}

## Notes
- Component extends BaseComponent for common functionality
- Includes error handling and accessibility support
- Uses Tailwind CSS for styling
- Follows project coding standards
`;

  const readmeFilePath = path.join(componentDir, 'README.md');
  fs.writeFileSync(readmeFilePath, readmeContent);
  
  console.log(`✓ Generated README: ${readmeFilePath}`);
}

/**
 * Update barrel export
 */
function updateBarrelExport() {
  const barrelPath = path.join(outputPath, 'index.ts');
  
  if (fs.existsSync(barrelPath)) {
    let barrelContent = fs.readFileSync(barrelPath, 'utf8');
    const exportLine = `export { ${className} } from './${componentName}/${componentName}.component';`;
    
    if (!barrelContent.includes(exportLine)) {
      barrelContent += `\n${exportLine}`;
      fs.writeFileSync(barrelPath, barrelContent);
      console.log(`✓ Updated barrel export: ${barrelPath}`);
    }
  }
}

// Main execution
console.log(`Generating ${componentType} component: ${componentName}`);
console.log(`Class name: ${className}`);
console.log(`Selector: ${selector}`);
console.log(`Output path: ${outputPath}`);
console.log('');

try {
  createComponentDirectory();
  generateComponentFile();
  generateSpecFile();
  generateReadmeFile();
  updateBarrelExport();
  
  console.log('');
  console.log('✅ Component generated successfully!');
  console.log(`📁 Location: ${componentDir}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Customize the component template and logic');
  console.log('2. Update the component styles');
  console.log('3. Add the component to your imports');
  console.log('4. Run tests to ensure everything works');
} catch (error) {
  console.error('❌ Error generating component:', error.message);
  process.exit(1);
}