import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

// Mock localStorage for testing
const mockLocalStorage = {
  getItem: jasmine.createSpy('getItem').and.returnValue(null),
  setItem: jasmine.createSpy('setItem'),
};

// Mock window.matchMedia
const mockMatchMedia = jasmine.createSpy('matchMedia').and.returnValue({
  matches: false,
  addEventListener: jasmine.createSpy('addEventListener'),
  addListener: jasmine.createSpy('addListener')
});

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Mock browser APIs
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    mockLocalStorage.getItem.calls.reset();
    mockLocalStorage.setItem.calls.reset();
    mockMatchMedia.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default theme as auto', () => {
    expect(service.theme()).toBe('auto');
  });

  it('should update theme when setTheme is called', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
    
    service.setTheme('light');
    expect(service.theme()).toBe('light');
  });

  it('should toggle theme correctly', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should return computed theme', () => {
    service.setTheme('light');
    expect(service.getComputedTheme()).toBe('light');
    
    service.setTheme('dark');
    expect(service.getComputedTheme()).toBe('dark');
  });
});