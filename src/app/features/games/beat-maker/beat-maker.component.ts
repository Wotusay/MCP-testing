import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import {
  BeatMakerGameService,
  GameState,
  BeatPattern,
} from './services/beat-maker-game.service';

@Component({
  selector: 'app-beat-maker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, ButtonComponent, FormsModule],
  template: `
    <div
      class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200"
    >
      <div class="max-w-7xl mx-auto px-4 py-6">
        <!-- Header -->
        <header class="text-center mb-6">
          <h1
            class="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2"
          >
            🎵 Beat Maker
          </h1>
          <p class="text-body-md text-secondary-600 dark:text-secondary-400">
            Create musical beats with our interactive drum sequencer!
          </p>
        </header>

        <div *ngIf="gameState$ | async as gameState" class="space-y-6">
          <!-- Main Grid Layout -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Left Column: Controls -->
            <div class="xl:col-span-1 space-y-4">
              <!-- Transport Controls -->
              <div
                class="bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 p-4"
              >
                <h3
                  class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3"
                >
                  Transport
                </h3>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <app-button
                      [text]="gameState.isPlaying ? 'Stop' : 'Play'"
                      [variant]="gameState.isPlaying ? 'danger' : 'primary'"
                      size="md"
                      (buttonClick)="togglePlayback(gameState.isPlaying)"
                      class="flex-1"
                    ></app-button>
                    <app-button
                      text="Clear"
                      variant="secondary"
                      size="md"
                      (buttonClick)="clearPattern()"
                      class="flex-1"
                    ></app-button>
                  </div>

                  <div class="flex items-center gap-2">
                    <label
                      class="text-sm font-medium text-secondary-700 dark:text-secondary-300 min-w-[2.5rem]"
                    >
                      BPM:
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="200"
                      [value]="gameState.bpm"
                      (input)="setBpm($event)"
                      class="flex-1 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer dark:bg-secondary-700"
                    />
                    <span
                      class="text-sm font-mono text-secondary-700 dark:text-secondary-300 min-w-[3rem] text-right"
                    >
                      {{ gameState.bpm }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Pattern Management -->
              <div
                class="bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 p-4"
              >
                <h3
                  class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3"
                >
                  Patterns
                </h3>

                <div class="space-y-3">
                  <div class="flex gap-2">
                    <input
                      type="text"
                      [(ngModel)]="patternName"
                      placeholder="Pattern name"
                      class="flex-1 px-3 py-2 text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <app-button
                      text="Save"
                      variant="primary"
                      size="sm"
                      (buttonClick)="savePattern()"
                      [disabled]="!patternName.trim()"
                    ></app-button>
                  </div>

                  <div class="flex gap-2" *ngIf="savedPatterns.length > 0">
                    <select
                      [(ngModel)]="selectedPatternId"
                      class="flex-1 px-3 py-2 text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select pattern...</option>
                      <option
                        *ngFor="let pattern of savedPatterns"
                        [value]="pattern.id"
                      >
                        {{ pattern.name }} ({{ pattern.bpm }} BPM)
                      </option>
                    </select>
                    <app-button
                      text="Load"
                      variant="secondary"
                      size="sm"
                      (buttonClick)="loadPattern()"
                      [disabled]="!selectedPatternId"
                    ></app-button>
                  </div>
                </div>
              </div>

              <!-- Instructions - Compact Version -->
              <div
                class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-4"
              >
                <h3
                  class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2"
                >
                  🎵 Quick Guide
                </h3>
                <ul
                  class="text-xs text-primary-700 dark:text-primary-300 space-y-1"
                >
                  <li>• Click track buttons to preview sounds</li>
                  <li>• Click grid squares to toggle beats</li>
                  <li>• Adjust BPM slider for tempo</li>
                  <li>• Use Play/Stop for control</li>
                  <li>• Save/load your patterns</li>
                </ul>
              </div>
            </div>

            <!-- Right Column: Sequencer -->
            <div class="xl:col-span-2">
              <div
                class="bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 p-4"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3
                    class="text-lg font-semibold text-secondary-900 dark:text-secondary-100"
                  >
                    Drum Sequencer
                  </h3>
                  <div
                    *ngIf="gameState.isPlaying"
                    class="text-sm text-secondary-600 dark:text-secondary-400"
                  >
                    Step: {{ gameState.currentStep + 1 }}/{{ gameState.steps }}
                  </div>
                </div>

                <!-- Step Numbers -->
                <div class="flex gap-2 mb-2">
                  <div class="w-16 sm:w-20"></div>
                  <div class="flex-1 grid grid-flow-col gap-0.5 sm:gap-1">
                    <div
                      *ngFor="
                        let step of getStepArray(gameState.steps);
                        let i = index
                      "
                      class="text-xs text-center text-secondary-500 dark:text-secondary-400 py-1"
                    >
                      {{ i + 1 }}
                    </div>
                  </div>
                </div>

                <!-- Drum Tracks -->
                <div
                  *ngFor="let track of gameState.tracks"
                  class="flex  gap-2 mb-1.5 sm:mb-2"
                >
                  <!-- Track Label -->
                  <div class="w-16 sm:w-20 flex items-center">
                    <button
                      (click)="playSound(track.id)"
                      class="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs font-medium text-white rounded transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      [ngClass]="track.color"
                    >
                      {{ track.name }}
                    </button>
                  </div>

                  <!-- Step Buttons -->
                  <div class="flex-1 grid grid-flow-col gap-0.5 sm:gap-1">
                    <button
                      *ngFor="
                        let step of getStepArray(gameState.steps);
                        let i = index
                      "
                      (click)="toggleStep(track.id, i)"
                      class="aspect-square rounded border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      [ngClass]="{
                        'border-secondary-300 dark:border-secondary-600 bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600':
                          !isStepActive(gameState.pattern, track.id, i),
                        'border-primary-500 bg-primary-500 hover:bg-primary-600 shadow-lg':
                          isStepActive(gameState.pattern, track.id, i),
                        'ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-gray-800':
                          gameState.currentStep === i && gameState.isPlaying,
                      }"
                    >
                      <span class="sr-only">
                        Toggle {{ track.name }} step {{ i + 1 }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BeatMakerComponent implements OnInit, OnDestroy {
  private readonly gameService = inject(BeatMakerGameService);
  private readonly destroy$ = new Subject<void>();

  public gameState$: Observable<GameState>;
  public patternName = '';
  public selectedPatternId = '';
  public savedPatterns: BeatPattern[] = [];

  constructor() {
    this.gameState$ = this.gameService.gameState$;
  }

  ngOnInit(): void {
    this.loadSavedPatterns();

    // Subscribe to game state changes
    this.gameState$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // Handle any state changes if needed
    });
  }

  ngOnDestroy(): void {
    this.gameService.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public togglePlayback(isPlaying: boolean): void {
    if (isPlaying) {
      this.gameService.stop();
    } else {
      this.gameService.play();
    }
  }

  public toggleStep(trackId: string, stepIndex: number): void {
    this.gameService.toggleStep(trackId, stepIndex);
  }

  public setBpm(event: Event): void {
    const target = event.target as HTMLInputElement;
    const bpm = parseInt(target.value, 10);
    this.gameService.setBpm(bpm);
  }

  public clearPattern(): void {
    this.gameService.clearPattern();
  }

  public playSound(trackId: string): void {
    this.gameService.playSound(trackId);
  }

  public savePattern(): void {
    if (this.patternName.trim()) {
      this.gameService.savePattern(this.patternName.trim());
      this.loadSavedPatterns();
      this.patternName = '';
    }
  }

  public loadPattern(): void {
    if (this.selectedPatternId) {
      const pattern = this.savedPatterns.find(
        (p) => p.id === this.selectedPatternId,
      );
      if (pattern) {
        this.gameService.loadPattern(pattern);
      }
    }
  }

  public getStepArray(steps: number): number[] {
    return Array.from({ length: steps }, (_, i) => i);
  }

  public isStepActive(
    pattern: { [trackId: string]: boolean[] },
    trackId: string,
    stepIndex: number,
  ): boolean {
    return pattern[trackId]?.[stepIndex] || false;
  }

  private loadSavedPatterns(): void {
    this.savedPatterns = this.gameService.getSavedPatterns();
  }
}
