import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  HostListener,
  inject,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameBoardComponent } from './components/game-board.component';
import { GameKeyboardComponent } from './components/game-keyboard.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { WordleGameService, GameState } from './services/wordle-game.service';

@Component({
  selector: 'app-wordle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    GameBoardComponent,
    GameKeyboardComponent,
    ButtonComponent,
  ],
  template: `
    <div
      class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200"
    >
      <div class="max-w-md mx-auto px-4 py-6">
        <!-- Header -->
        <header class="text-center mb-8">
          <h1
            class="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2"
          >
            Wordle
          </h1>
          <p class="text-body-md text-secondary-600 dark:text-secondary-400">
            Guess the 5-letter word in 6 tries
          </p>
        </header>

        <!-- Game Board -->
        <div class="mb-8">
          <app-game-board
            *ngIf="gameState$ | async as gameState"
            [gameState]="gameState"
          />
        </div>

        <!-- Game Status Messages -->
        <div class="text-center mb-6" *ngIf="gameState$ | async as gameState">
          <div
            *ngIf="gameState.gameStatus === 'won'"
            class="bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 text-success-800 dark:text-success-200 px-4 py-3 rounded-lg mb-4"
            role="alert"
            aria-live="polite"
          >
            <p class="font-semibold">Congratulations! 🎉</p>
            <p class="text-sm">
              You guessed the word in {{ gameState.guesses.length }} tries!
            </p>
          </div>

          <div
            *ngIf="gameState.gameStatus === 'lost'"
            class="bg-danger-100 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-200 px-4 py-3 rounded-lg mb-4"
            role="alert"
            aria-live="polite"
          >
            <p class="font-semibold">Game Over! 😔</p>
            <p class="text-sm">
              The word was: <strong>{{ gameState.targetWord }}</strong>
            </p>
          </div>

          <!-- New Game Button -->
          <div *ngIf="gameState.gameStatus !== 'playing'" class="mb-4">
            <app-button
              text="New Game"
              variant="primary"
              (buttonClick)="startNewGame()"
            />
          </div>
        </div>

        <!-- Instructions -->
        <ng-container *ngIf="gameState$ | async as gameState">
          <div
            *ngIf="
              gameState.gameStatus === 'playing' &&
              gameState.guesses.length === 0
            "
            class="bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 mb-6"
          >
            <h3
              class="font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              How to Play:
            </h3>
            <ul
              class="text-sm text-secondary-700 dark:text-secondary-300 space-y-1"
            >
              <li>• Type or click letters to make a guess</li>
              <li>• Press ENTER to submit your guess</li>
              <li>
                •
                <span
                  class="inline-block w-4 h-4 bg-success-500 rounded"
                ></span>
                Green = correct letter, correct position
              </li>
              <li>
                •
                <span
                  class="inline-block w-4 h-4 bg-warning-500 rounded"
                ></span>
                Yellow = correct letter, wrong position
              </li>
              <li>
                •
                <span
                  class="inline-block w-4 h-4 bg-secondary-500 rounded"
                ></span>
                Gray = letter not in word
              </li>
            </ul>
          </div>
        </ng-container>

        <!-- Keyboard -->
        <app-game-keyboard
          *ngIf="gameState$ | async as gameState"
          [keyboardState]="gameState.keyboardState"
          [disabled]="gameState.gameStatus !== 'playing'"
          (letterPress)="onLetterPress($event)"
          (enterPress)="onEnterPress()"
          (backspacePress)="onBackspacePress()"
        />

        <!-- Game Info -->
        <div
          class="text-center mt-8 text-sm text-secondary-500 dark:text-secondary-500"
        >
          <p>A Wordle clone built with Angular</p>
        </div>
      </div>
    </div>
  `,
})
export class WordleComponent implements OnInit, OnDestroy {
  gameState$: Observable<GameState>;
  private destroy$ = new Subject<void>();
  private gameService = inject(WordleGameService);

  constructor() {
    this.gameState$ = this.gameService.gameState$;
  }

  ngOnInit(): void {
    // Subscribe to game state for any additional side effects if needed
    this.gameState$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // Could add sound effects, analytics, or other side effects here
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyboardInput(event: KeyboardEvent): void {
    const key = event.key.toUpperCase();

    // Prevent default browser shortcuts
    if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
      event.preventDefault();
    }

    if (/^[A-Z]$/.test(key)) {
      this.onLetterPress(key);
    } else if (key === 'ENTER') {
      this.onEnterPress();
    } else if (key === 'BACKSPACE') {
      this.onBackspacePress();
    }
  }

  onLetterPress(letter: string): void {
    this.gameService.addLetter(letter);
  }

  onEnterPress(): void {
    this.gameService.submitGuess();
  }

  onBackspacePress(): void {
    this.gameService.removeLetter();
  }

  startNewGame(): void {
    this.gameService.startNewGame();
  }
}
