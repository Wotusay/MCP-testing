import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TypingStatsComponent } from './typing-stats.component';

describe('TypingStatsComponent', () => {
  let component: TypingStatsComponent;
  let fixture: ComponentFixture<TypingStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingStatsComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TypingStatsComponent);
    component = fixture.componentInstance;

    // Set initial inputs
    component.stats = {
      wpm: 60,
      accuracy: 95,
      remainingTime: 30,
      isComplete: false,
    };

    component.config = {
      mode: 'time',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display live stats when test is not complete', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('60');
    expect(compiled.textContent).toContain('WPM');
    expect(compiled.textContent).toContain('95%');
    expect(compiled.textContent).toContain('Accuracy');
  });

  it('should display remaining time for time mode', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('30');
    expect(compiled.textContent).toContain('Seconds');
  });

  it('should not display remaining time for words mode', () => {
    // Set input using the proper setInput method to trigger OnPush change detection
    fixture.componentRef.setInput('config', { mode: 'words' });
    fixture.componentRef.setInput('stats', {
      wpm: 60,
      accuracy: 95,
      remainingTime: 30,
      isComplete: false,
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Seconds');
  });

  it('should display completion stats when test is complete', () => {
    // Set input using the proper setInput method to trigger OnPush change detection
    fixture.componentRef.setInput('stats', {
      wpm: 75,
      accuracy: 98,
      remainingTime: 0,
      isComplete: true,
      duration: 60,
    });
    fixture.componentRef.setInput('config', {
      mode: 'time',
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test Complete!');
    expect(compiled.textContent).toContain('75');
    expect(compiled.textContent).toContain('98%');
  });
});
