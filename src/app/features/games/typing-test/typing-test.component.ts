import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  TypingStatsComponent,
  TypingConfigComponent,
  TestConfig,
} from '../../../shared/components';

interface TypingSession {
  text: string;
  currentIndex: number;
  startTime: number | null;
  endTime: number | null;
  correctChars: number;
  totalChars: number;
  isComplete: boolean;
  wpm: number;
  accuracy: number;
  timeLimit: number; // in seconds
  remainingTime: number;
}

@Component({
  selector: 'app-typing-test',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TypingStatsComponent, TypingConfigComponent],
  template: `
    <div
      class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200"
    >
      <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Header -->
        <header class="text-center mb-8">
          <div class="flex items-center justify-between mb-6">
            <button
              (click)="goBack()"
              class="flex items-center px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors duration-200"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Games
            </button>

            <h1
              class="text-3xl font-bold text-secondary-900 dark:text-secondary-100"
            >
              ⌨️ Typing Test
            </h1>

            <div class="w-24"></div>
            <!-- Spacer for centering -->
          </div>

          <p
            class="text-body-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto"
          >
            Test your typing speed and accuracy. Focus on the text below and
            start typing!
          </p>
        </header>

        <!-- Test Configuration -->
        <div *ngIf="!session().startTime && !session().isComplete" class="mb-8">
          <app-typing-config
            [config]="config()"
            (configChange)="onConfigChange($event)"
            (startTest)="startNewTest()"
          ></app-typing-config>
        </div>

        <!-- Typing Test Area -->
        <div *ngIf="session().startTime && !session().isComplete" class="mb-8">
          <!-- Live Stats -->
          <app-typing-stats
            [stats]="{
              wpm: session().wpm,
              accuracy: session().accuracy,
              remainingTime: session().remainingTime,
              isComplete: false,
            }"
            [config]="{ mode: config().mode }"
          ></app-typing-stats>

          <!-- Text Display -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-8 border-2 border-secondary-200 dark:border-secondary-700 focus-within:border-primary-500 transition-colors duration-200 overflow-hidden"
          >
            <div
              class="text-xl leading-relaxed font-mono break-words overflow-wrap-anywhere"
              [style.font-size]="'1.25rem'"
              [style.line-height]="'2rem'"
              [style.word-break]="'break-word'"
              [style.overflow-wrap]="'anywhere'"
            >
              <span
                *ngFor="let char of textChars(); let i = index"
                [class]="getCharClass(i)"
                >{{ char === ' ' ? '␣' : char }}</span
              >
              <span
                *ngIf="session().currentIndex === textChars().length"
                class="cursor animate-pulse bg-primary-500 text-white"
                >|</span
              >
            </div>

            <!-- Invisible input for capturing keystrokes -->
            <input
              #typingInput
              type="text"
              class="absolute opacity-0 pointer-events-none"
              (input)="onInput($event)"
              (keydown)="onKeyDown($event)"
              [value]="currentInput()"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </div>

          <!-- Progress Bar -->
          <div class="mt-4">
            <div
              class="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2"
            >
              <div
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                [style.width.%]="getProgress()"
              ></div>
            </div>
            <div
              class="text-center mt-2 text-sm text-secondary-600 dark:text-secondary-400"
            >
              {{ session().currentIndex }} / {{ textChars().length }} characters
            </div>
          </div>
        </div>

        <!-- Results Screen -->
        <app-typing-stats
          *ngIf="session().isComplete"
          [stats]="{
            wpm: session().wpm,
            accuracy: session().accuracy,
            remainingTime: session().remainingTime,
            isComplete: true,
            duration: getTestDuration(),
          }"
          [config]="{ mode: config().mode }"
        ></app-typing-stats>

        <!-- Action Buttons for Results -->
        <div
          *ngIf="session().isComplete"
          class="flex justify-center gap-4 mb-8"
        >
          <button
            (click)="startNewTest()"
            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Try Again
          </button>

          <button
            (click)="goBack()"
            class="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Back to Games
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TypingTestComponent implements OnInit, OnDestroy {
  private timer: number | null = null;

  // Inject dependencies using modern inject() function
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Reactive signals for state management
  session = signal<TypingSession>({
    text: '',
    currentIndex: 0,
    startTime: null,
    endTime: null,
    correctChars: 0,
    totalChars: 0,
    isComplete: false,
    wpm: 0,
    accuracy: 100,
    timeLimit: 60,
    remainingTime: 60,
  });

  config = signal<TestConfig>({
    mode: 'time',
    duration: 60,
    difficulty: 'medium',
  });

  currentInput = signal<string>('');

  // Computed values
  textChars = computed(() => this.session().text.split(''));

  ngOnInit(): void {
    this.generateText();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  goBack(): void {
    this.router.navigate(['/games']);
  }

  onConfigChange(newConfig: TestConfig): void {
    this.config.set(newConfig);
    if (newConfig.difficulty !== this.config().difficulty) {
      this.generateText();
    }
  }

  startNewTest(): void {
    this.generateText();
    this.currentInput.set('');

    this.session.set({
      text: this.session().text,
      currentIndex: 0,
      startTime: Date.now(),
      endTime: null,
      correctChars: 0,
      totalChars: 0,
      isComplete: false,
      wpm: 0,
      accuracy: 100,
      timeLimit: this.config().mode === 'time' ? this.config().duration : 0,
      remainingTime: this.config().mode === 'time' ? this.config().duration : 0,
    });

    if (this.config().mode === 'time') {
      this.startTimer();
    }

    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      const input = document.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  private startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = window.setInterval(() => {
      const current = this.session();
      if (current.remainingTime <= 1) {
        this.completeTest();
      } else {
        this.session.update((session) => ({
          ...session,
          remainingTime: session.remainingTime - 1,
        }));
        this.updateWPM();
      }
    }, 1000);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!this.session().startTime) return;

    this.currentInput.set(value);
    this.processInput(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      // Allow backspace to work naturally
      return;
    }

    if (!this.session().startTime) return;

    // Prevent default for most keys to control input precisely
    if (event.key.length === 1) {
      event.preventDefault();
      const currentValue = this.currentInput();
      const newValue = currentValue + event.key;
      this.currentInput.set(newValue);
      this.processInput(newValue);
    }
  }

  private processInput(input: string): void {
    const session = this.session();
    const targetText = session.text;

    // Update current index based on input length
    const newIndex = Math.min(input.length, targetText.length);

    // Count correct characters
    let correctChars = 0;
    for (let i = 0; i < newIndex; i++) {
      if (input[i] === targetText[i]) {
        correctChars++;
      }
    }

    // Calculate accuracy
    const accuracy =
      newIndex > 0 ? Math.round((correctChars / newIndex) * 100) : 100;

    this.session.update((session) => ({
      ...session,
      currentIndex: newIndex,
      correctChars,
      totalChars: newIndex,
      accuracy,
    }));

    this.updateWPM();

    // Check if test is complete
    if (this.config().mode === 'words' && newIndex >= targetText.length) {
      this.completeTest();
    }
  }

  private updateWPM(): void {
    const session = this.session();
    if (!session.startTime) return;

    const elapsed = (Date.now() - session.startTime) / 1000 / 60; // minutes
    const wordsTyped = session.correctChars / 5; // Standard: 5 characters = 1 word
    const wpm = elapsed > 0 ? Math.round(wordsTyped / elapsed) : 0;

    this.session.update((session) => ({ ...session, wpm }));
  }

  private completeTest(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.session.update((session) => ({
      ...session,
      endTime: Date.now(),
      isComplete: true,
    }));

    this.updateWPM();
  }

  getCharClass(index: number): string {
    const session = this.session();
    const input = this.currentInput();

    if (index < input.length) {
      // Character has been typed
      if (input[index] === session.text[index]) {
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30';
      } else {
        return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900/30';
      }
    } else if (index === input.length) {
      // Current character (cursor position)
      return 'bg-primary-200 dark:bg-primary-800 text-primary-900 dark:text-primary-100';
    } else {
      // Untyped characters
      return 'text-secondary-600 dark:text-secondary-400';
    }
  }

  getProgress(): number {
    const session = this.session();
    if (this.config().mode === 'time') {
      return (
        ((this.config().duration - session.remainingTime) /
          this.config().duration) *
        100
      );
    } else {
      return (session.currentIndex / session.text.length) * 100;
    }
  }

  getTestDuration(): number {
    const session = this.session();
    if (session.startTime && session.endTime) {
      return Math.round((session.endTime - session.startTime) / 1000);
    }
    return 0;
  }

  private generateText(): void {
    const difficulty = this.config().difficulty;
    const wordCount =
      this.config().mode === 'words' ? this.config().duration : 50;

    let words: string[] = [];

    if (difficulty === 'easy') {
      words = [
        'the',
        'quick',
        'brown',
        'fox',
        'jumps',
        'over',
        'lazy',
        'dog',
        'and',
        'runs',
        'fast',
        'home',
        'cat',
        'sits',
        'sun',
        'moon',
        'star',
        'tree',
        'book',
        'pen',
        'car',
        'bus',
        'run',
        'walk',
        'play',
        'work',
        'read',
        'write',
        'sing',
        'dance',
      ];
    } else if (difficulty === 'medium') {
      words = [
        'ability',
        'absolute',
        'academy',
        'accept',
        'accident',
        'accompany',
        'according',
        'account',
        'accurate',
        'achieve',
        'across',
        'action',
        'activity',
        'actually',
        'address',
        'administration',
        'admit',
        'adult',
        'advance',
        'advantage',
        'adventure',
        'advertising',
        'advice',
        'advocate',
        'affair',
        'affect',
        'afford',
        'afraid',
        'African',
        'after',
      ];
    } else {
      words = [
        'accommodate',
        'accompaniment',
        'acknowledgment',
        'administration',
        'advantageous',
        'analytical',
        'appreciation',
        'architecture',
        'arrangement',
        'articulation',
        'assessment',
        'assignment',
        'association',
        'assumption',
        'atmosphere',
        'attachment',
        'attention',
        'attribution',
        'authentication',
        'authorization',
        'automatically',
        'availability',
        'background',
        'beautiful',
        'beginning',
        'breakthrough',
        'calculation',
        'celebration',
        'characteristic',
        'circumstance',
      ];
    }

    const selectedWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      selectedWords.push(words[Math.floor(Math.random() * words.length)]);
    }

    const text = selectedWords.join(' ');
    this.session.update((session) => ({ ...session, text }));
  }
}
