import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TypingConfigComponent } from './typing-config.component';

describe('TypingConfigComponent', () => {
  let component: TypingConfigComponent;
  let fixture: ComponentFixture<TypingConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingConfigComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TypingConfigComponent);
    component = fixture.componentInstance;

    // Set initial config
    component.config = {
      mode: 'time',
      duration: 60,
      difficulty: 'medium',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct mode button class', () => {
    const activeClass = component['getModeButtonClass']('time');
    const inactiveClass = component['getModeButtonClass']('words');

    expect(activeClass).toContain('bg-primary-600');
    expect(inactiveClass).toContain('bg-secondary-100');
  });

  it('should get correct duration options based on mode', () => {
    component.config = { mode: 'time', duration: 60, difficulty: 'medium' };
    expect(component['getDurationOptions']()).toEqual([15, 30, 60, 120]);

    component.config = { mode: 'words', duration: 25, difficulty: 'medium' };
    expect(component['getDurationOptions']()).toEqual([10, 25, 50, 100]);
  });

  it('should emit config change when mode changes', () => {
    spyOn(component.configChange, 'emit');

    component['onModeChange']('words');

    expect(component.configChange.emit).toHaveBeenCalledWith({
      mode: 'words',
      duration: 25,
      difficulty: 'medium',
    });
  });

  it('should emit config change when duration changes', () => {
    spyOn(component.configChange, 'emit');

    component['onDurationChange'](120);

    expect(component.configChange.emit).toHaveBeenCalledWith({
      mode: 'time',
      duration: 120,
      difficulty: 'medium',
    });
  });

  it('should emit config change when difficulty changes', () => {
    spyOn(component.configChange, 'emit');

    component['onDifficultyChange']('easy');

    expect(component.configChange.emit).toHaveBeenCalledWith({
      mode: 'time',
      duration: 60,
      difficulty: 'easy',
    });
  });

  it('should emit start test event', () => {
    spyOn(component.startTest, 'emit');

    component['onStartTest']();

    expect(component.startTest.emit).toHaveBeenCalled();
  });

  it('should get correct duration button class', () => {
    component.config = { mode: 'time', duration: 60, difficulty: 'medium' };

    const activeClass = component['getDurationButtonClass'](60);
    const inactiveClass = component['getDurationButtonClass'](30);

    expect(activeClass).toContain('bg-primary-600');
    expect(inactiveClass).toContain('bg-secondary-100');
  });

  it('should get correct difficulty button class', () => {
    const activeClass = component['getDifficultyButtonClass']('medium');
    const inactiveClass = component['getDifficultyButtonClass']('easy');

    expect(activeClass).toContain('bg-primary-600');
    expect(inactiveClass).toContain('bg-secondary-100');
  });
});
