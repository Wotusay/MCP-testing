import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';

import { MaterialDemoComponent } from './material-demo.component';

describe('MaterialDemoComponent', () => {
  let component: MaterialDemoComponent;
  let fixture: ComponentFixture<MaterialDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialDemoComponent],
      providers: [provideZonelessChangeDetection(), provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Angular Material Integration Demo',
    );
  });

  it('should display Material buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button[mat-raised-button]')).toBeTruthy();
  });

  it('should display custom buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-button')).toBeTruthy();
  });

  it('should display status badges', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-status-badge')).toBeTruthy();
  });

  it('should display Material cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card')).toBeTruthy();
  });

  it('should display Material chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-chip')).toBeTruthy();
  });

  it('should display integration notes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("What's Preserved");
    expect(compiled.textContent).toContain("What's Added");
  });
});
