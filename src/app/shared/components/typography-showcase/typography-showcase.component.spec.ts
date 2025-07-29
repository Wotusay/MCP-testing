import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TypographyShowcaseComponent } from './typography-showcase.component';

describe('TypographyShowcaseComponent', () => {
  let component: TypographyShowcaseComponent;
  let fixture: ComponentFixture<TypographyShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypographyShowcaseComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TypographyShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render typography scale sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Check for main sections
    expect(compiled.querySelector('h1')).toBeTruthy();
    expect(compiled.textContent).toContain('Typography Scale & Color Palette');
    expect(compiled.textContent).toContain('Display Sizes');
    expect(compiled.textContent).toContain('Headings');
    expect(compiled.textContent).toContain('Body Text');
    expect(compiled.textContent).toContain('Specialized Text');
    expect(compiled.textContent).toContain('Color Palette');
  });

  it('should display all heading levels', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Check for heading examples
    expect(compiled.textContent).toContain('Main Page Heading');
    expect(compiled.textContent).toContain('Section Heading');
    expect(compiled.textContent).toContain('Subsection Heading');
    expect(compiled.textContent).toContain('Article Heading');
    expect(compiled.textContent).toContain('Small Heading');
  });

  it('should display body text examples', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Body XL');
    expect(compiled.textContent).toContain('Body Large (Default)');
    expect(compiled.textContent).toContain('Body Medium');
    expect(compiled.textContent).toContain('Body Small');
  });

  it('should display specialized text examples', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Links');
    expect(compiled.textContent).toContain('Emphasis & Muted');
    expect(compiled.textContent).toContain('Caption & Overline');
    expect(compiled.textContent).toContain('Status Text');
  });

  it('should display color palette sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Primary (Blue)');
    expect(compiled.textContent).toContain('Secondary (Slate)');
    expect(compiled.textContent).toContain('Success (Green)');
    expect(compiled.textContent).toContain('Warning (Amber)');
    expect(compiled.textContent).toContain('Danger (Red)');
  });

  it('should have primary color shades defined', () => {
    expect(component.primaryShades).toBeDefined();
    expect(component.primaryShades.length).toBe(11);
    expect(component.primaryShades[0].name).toBe('50');
    expect(component.primaryShades[10].name).toBe('950');
  });

  it('should have secondary color shades defined', () => {
    expect(component.secondaryShades).toBeDefined();
    expect(component.secondaryShades.length).toBe(11);
    expect(component.secondaryShades[0].name).toBe('50');
    expect(component.secondaryShades[10].name).toBe('950');
  });

  it('should have semantic color shades defined', () => {
    expect(component.successShades).toBeDefined();
    expect(component.warningShades).toBeDefined();
    expect(component.dangerShades).toBeDefined();

    expect(component.successShades.length).toBe(5);
    expect(component.warningShades.length).toBe(5);
    expect(component.dangerShades.length).toBe(5);
  });

  it('should apply correct CSS classes for typography', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Check for typography classes
    const displayText = compiled.querySelector('.text-display-lg');
    expect(displayText).toBeTruthy();

    const h1Element = compiled.querySelector('.text-h1');
    expect(h1Element).toBeTruthy();

    const bodyText = compiled.querySelector('.text-body-lg');
    expect(bodyText).toBeTruthy();

    const captionText = compiled.querySelector('.text-caption');
    expect(captionText).toBeTruthy();
  });

  it('should apply correct CSS classes for colors', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Check for color classes
    const primaryColor = compiled.querySelector('.bg-primary-500');
    expect(primaryColor).toBeTruthy();

    const secondaryColor = compiled.querySelector('.bg-secondary-500');
    expect(secondaryColor).toBeTruthy();

    const successColor = compiled.querySelector('.bg-success-500');
    expect(successColor).toBeTruthy();
  });
});
