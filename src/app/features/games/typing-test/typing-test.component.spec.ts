import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { TypingTestComponent } from './typing-test.component';

describe('TypingTestComponent', () => {
  let component: TypingTestComponent;
  let fixture: ComponentFixture<TypingTestComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TypingTestComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TypingTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default configuration', () => {
    expect(component.config().mode).toBe('time');
    expect(component.config().duration).toBe(60);
    expect(component.config().difficulty).toBe('medium');
  });

  it('should generate text on init', () => {
    expect(component.session().text).toBeTruthy();
    expect(component.session().text.length).toBeGreaterThan(0);
  });

  it('should navigate back to games when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/games']);
  });

  it('should update mode and duration when setMode is called', () => {
    component.setMode('words');
    expect(component.config().mode).toBe('words');
    expect(component.config().duration).toBe(25);
  });

  it('should update difficulty when setDifficulty is called', () => {
    component.setDifficulty('easy');
    expect(component.config().difficulty).toBe('easy');
  });

  it('should start new test with correct initial state', () => {
    component.startNewTest();
    const session = component.session();

    expect(session.startTime).toBeTruthy();
    expect(session.currentIndex).toBe(0);
    expect(session.correctChars).toBe(0);
    expect(session.totalChars).toBe(0);
    expect(session.isComplete).toBe(false);
    expect(session.wpm).toBe(0);
    expect(session.accuracy).toBe(100);
  });

  it('should get correct mode button class', () => {
    const activeClass = component.getModeButtonClass('time');
    const inactiveClass = component.getModeButtonClass('words');

    expect(activeClass).toContain('bg-primary-600');
    expect(inactiveClass).toContain('bg-secondary-100');
  });

  it('should get correct duration options based on mode', () => {
    component.setMode('time');
    expect(component.getDurationOptions()).toEqual([15, 30, 60, 120]);

    component.setMode('words');
    expect(component.getDurationOptions()).toEqual([10, 25, 50, 100]);
  });

  it('should calculate progress correctly', () => {
    // Set mode to words first so progress is based on character count
    component.setMode('words');
    component.startNewTest();
    // Mock some progress
    component.session.update((session) => ({
      ...session,
      currentIndex: 10,
      text: 'a'.repeat(100),
    }));

    expect(component.getProgress()).toBe(10);
  });

  it('should get correct character classes for typed text', () => {
    component.startNewTest();
    component.session.update((session) => ({
      ...session,
      text: 'hello world',
    }));
    component.currentInput.set('hel');

    // Correct characters should have success class
    expect(component.getCharClass(0)).toContain('text-success-600');
    expect(component.getCharClass(1)).toContain('text-success-600');
    expect(component.getCharClass(2)).toContain('text-success-600');

    // Current character should have primary background
    expect(component.getCharClass(3)).toContain('bg-primary-200');

    // Untyped characters should have secondary text
    expect(component.getCharClass(4)).toContain('text-secondary-600');
  });

  it('should handle incorrect typing with error styling', () => {
    component.startNewTest();
    component.session.update((session) => ({
      ...session,
      text: 'hello',
    }));
    component.currentInput.set('hxllo');

    // First character correct
    expect(component.getCharClass(0)).toContain('text-success-600');

    // Second character incorrect
    expect(component.getCharClass(1)).toContain('text-danger-600');
  });
});
