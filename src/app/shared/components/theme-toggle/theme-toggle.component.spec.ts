import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../services/theme.service';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let mockThemeService: Partial<ThemeService>;

  beforeEach(async () => {
    // Create mock theme service with signals
    mockThemeService = {
      theme: signal('light' as 'light' | 'dark' | 'auto'),
      isDark: signal(false),
      toggleTheme: jasmine.createSpy('toggleTheme')
    };

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleTheme when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('should display sun icon in light mode', () => {
    const sunIcon = fixture.nativeElement.querySelector('svg');
    expect(sunIcon).toBeTruthy();
  });
});