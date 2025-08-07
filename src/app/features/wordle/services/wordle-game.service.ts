import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TileState = 'empty' | 'correct' | 'present' | 'absent';
export type GameStatus = 'playing' | 'won' | 'lost';
export type KeyboardKeyState = 'default' | 'correct' | 'present' | 'absent';

export interface GameTile {
  letter: string;
  state: TileState;
}

export interface GameRow {
  tiles: GameTile[];
  submitted: boolean;
}

export interface KeyboardKey {
  key: string;
  state: KeyboardKeyState;
}

export interface GameState {
  board: GameRow[];
  currentRow: number;
  currentCol: number;
  gameStatus: GameStatus;
  targetWord: string;
  guesses: string[];
  keyboardState: Map<string, KeyboardKeyState>;
}

@Injectable({
  providedIn: 'root',
})
export class WordleGameService {
  private readonly WORD_LENGTH = 5;
  private readonly MAX_GUESSES = 6;

  // Common 5-letter words for the game
  private readonly WORD_LIST = [
    'ABOUT',
    'ABOVE',
    'ABUSE',
    'ACTOR',
    'ACUTE',
    'ADMIT',
    'ADOPT',
    'ADULT',
    'AFTER',
    'AGAIN',
    'AGENT',
    'AGREE',
    'AHEAD',
    'ALARM',
    'ALBUM',
    'ALERT',
    'ALIEN',
    'ALIGN',
    'ALIKE',
    'ALIVE',
    'ALLOW',
    'ALONE',
    'ALONG',
    'ALTER',
    'AMBER',
    'AMONG',
    'ANGEL',
    'ANGER',
    'ANGLE',
    'ANGRY',
    'APART',
    'APPLE',
    'APPLY',
    'ARENA',
    'ARGUE',
    'ARISE',
    'ARRAY',
    'ARROW',
    'ASIDE',
    'ASSET',
    'AUDIO',
    'AUDIT',
    'AVOID',
    'AWAKE',
    'AWARD',
    'AWARE',
    'BADLY',
    'BAKER',
    'BASIC',
    'BEACH',
    'BEGAN',
    'BEGIN',
    'BEING',
    'BELOW',
    'BENCH',
    'BILLY',
    'BIRTH',
    'BLACK',
    'BLAME',
    'BLANK',
    'BLIND',
    'BLOCK',
    'BLOOD',
    'BOARD',
    'BOOST',
    'BOOTH',
    'BOUND',
    'BRAIN',
    'BRAND',
    'BRASS',
    'BRAVE',
    'BREAD',
    'BREAK',
    'BREED',
    'BRIEF',
    'BRING',
    'BROAD',
    'BROKE',
    'BROWN',
    'BUILD',
    'BUILT',
    'BUYER',
    'CABLE',
    'CARRY',
    'CATCH',
    'CAUSE',
    'CHAIN',
    'CHAIR',
    'CHAOS',
    'CHARM',
    'CHART',
    'CHASE',
    'CHEAP',
    'CHECK',
    'CHEST',
    'CHIEF',
    'CHILD',
    'CHINA',
    'CHOSE',
    'CIVIL',
  ];

  private readonly VALID_WORDS = new Set([
    ...this.WORD_LIST,
    // Add more valid words for input validation
    'HOUSE',
    'WORDS',
    'WORLD',
    'WRITE',
    'WRONG',
    'WROTE',
    'YOUNG',
    'YOUTH',
    'ZEBRA',
    'ZESTY',
  ]);

  private gameStateSubject = new BehaviorSubject<GameState>(
    this.createInitialState(),
  );
  public gameState$ = this.gameStateSubject.asObservable();

  constructor() {
    this.startNewGame();
  }

  private createInitialState(): GameState {
    return {
      board: Array(this.MAX_GUESSES)
        .fill(null)
        .map(() => ({
          tiles: Array(this.WORD_LENGTH)
            .fill(null)
            .map(() => ({
              letter: '',
              state: 'empty' as TileState,
            })),
          submitted: false,
        })),
      currentRow: 0,
      currentCol: 0,
      gameStatus: 'playing',
      targetWord: this.getRandomWord(),
      guesses: [],
      keyboardState: new Map(),
    };
  }

  private getRandomWord(): string {
    return this.WORD_LIST[Math.floor(Math.random() * this.WORD_LIST.length)];
  }

  startNewGame(): void {
    this.gameStateSubject.next(this.createInitialState());
  }

  addLetter(letter: string): void {
    const currentState = this.gameStateSubject.value;

    if (
      currentState.gameStatus !== 'playing' ||
      currentState.currentCol >= this.WORD_LENGTH
    ) {
      return;
    }

    const newState = { ...currentState };
    newState.board[newState.currentRow].tiles[newState.currentCol] = {
      letter: letter.toUpperCase(),
      state: 'empty',
    };
    newState.currentCol++;

    this.gameStateSubject.next(newState);
  }

  removeLetter(): void {
    const currentState = this.gameStateSubject.value;

    if (
      currentState.gameStatus !== 'playing' ||
      currentState.currentCol === 0
    ) {
      return;
    }

    const newState = { ...currentState };
    newState.currentCol--;
    newState.board[newState.currentRow].tiles[newState.currentCol] = {
      letter: '',
      state: 'empty',
    };

    this.gameStateSubject.next(newState);
  }

  submitGuess(): void {
    const currentState = this.gameStateSubject.value;

    if (
      currentState.gameStatus !== 'playing' ||
      currentState.currentCol !== this.WORD_LENGTH
    ) {
      return;
    }

    const guess = currentState.board[currentState.currentRow].tiles
      .map((tile) => tile.letter)
      .join('');

    if (!this.isValidWord(guess)) {
      // In a real app, you might show an error message here
      return;
    }

    const newState = { ...currentState };

    // Update tile states based on the target word
    this.evaluateGuess(newState, guess, currentState.currentRow);

    // Update keyboard state
    this.updateKeyboardState(newState, guess);

    // Mark row as submitted
    newState.board[newState.currentRow].submitted = true;
    newState.guesses.push(guess);

    // Check win condition
    if (guess === newState.targetWord) {
      newState.gameStatus = 'won';
    } else if (newState.currentRow >= this.MAX_GUESSES - 1) {
      newState.gameStatus = 'lost';
    } else {
      newState.currentRow++;
      newState.currentCol = 0;
    }

    this.gameStateSubject.next(newState);
  }

  private isValidWord(word: string): boolean {
    return this.VALID_WORDS.has(word.toUpperCase());
  }

  private evaluateGuess(
    state: GameState,
    guess: string,
    rowIndex: number,
  ): void {
    const targetWord = state.targetWord;
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    // First pass: mark correct positions
    const letterCounts = new Map<string, number>();
    for (const letter of targetLetters) {
      letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
    }

    // Mark correct positions first
    for (let i = 0; i < this.WORD_LENGTH; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        state.board[rowIndex].tiles[i].state = 'correct';
        letterCounts.set(
          guessLetters[i],
          letterCounts.get(guessLetters[i])! - 1,
        );
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < this.WORD_LENGTH; i++) {
      if (state.board[rowIndex].tiles[i].state !== 'correct') {
        const letter = guessLetters[i];
        const remainingCount = letterCounts.get(letter) || 0;

        if (remainingCount > 0) {
          state.board[rowIndex].tiles[i].state = 'present';
          letterCounts.set(letter, remainingCount - 1);
        } else {
          state.board[rowIndex].tiles[i].state = 'absent';
        }
      }
    }
  }

  private updateKeyboardState(state: GameState, guess: string): void {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const tileState = state.board[state.currentRow].tiles[i].state;
      const currentKeyState = state.keyboardState.get(letter);

      // Priority: correct > present > absent
      if (
        tileState === 'correct' ||
        (tileState === 'present' && currentKeyState !== 'correct') ||
        (tileState === 'absent' && !currentKeyState)
      ) {
        state.keyboardState.set(letter, tileState as KeyboardKeyState);
      }
    }
  }

  getCurrentState(): GameState {
    return this.gameStateSubject.value;
  }

  getGameStats(): {
    played: number;
    winRate: number;
    currentStreak: number;
    maxStreak: number;
  } {
    // For now, return dummy stats. In a real app, this would come from localStorage
    return {
      played: 0,
      winRate: 0,
      currentStreak: 0,
      maxStreak: 0,
    };
  }
}
