import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import {
  BubbleShooterGameService,
  GameState,
  Bubble,
  Particle,
} from './services/bubble-shooter-game.service';

@Component({
  selector: 'app-bubble-shooter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, ButtonComponent],
  template: `
    <div
      class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200"
    >
      <div class="max-w-md mx-auto px-4 py-6">
        <!-- Header -->
        <header class="text-center mb-6">
          <h1
            class="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2"
          >
            🫧 Bubble Shooter
          </h1>
          <p class="text-body-md text-secondary-600 dark:text-secondary-400">
            Match 3+ bubbles of the same color to clear them
          </p>
        </header>

        <!-- Score and Attempts Display -->
        <div
          class="flex justify-center gap-4 mb-4"
          *ngIf="gameState$ | async as gameState"
        >
          <div
            class="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg"
          >
            <span class="text-primary-800 dark:text-primary-200 font-semibold">
              Score: {{ gameState.score }}
            </span>
          </div>
          <div
            class="inline-flex items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 rounded-lg"
          >
            <span
              class="text-secondary-800 dark:text-secondary-200 font-semibold"
            >
              Attempts: {{ gameState.attemptsLeft }}/{{ gameState.maxAttempts }}
            </span>
          </div>
        </div>

        <!-- Game Canvas Container -->
        <div
          class="relative bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 p-4 mb-6"
        >
          <canvas
            #gameCanvas
            [width]="400"
            [height]="600"
            (click)="onCanvasClick($event)"
            class="block mx-auto border border-secondary-300 dark:border-secondary-600 rounded-lg cursor-crosshair bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20"
            style="max-width: 100%; height: auto;"
          >
            Your browser does not support the HTML5 canvas element.
          </canvas>

          <!-- Aiming Line -->
          <canvas
            #aimingCanvas
            [width]="400"
            [height]="600"
            (mousemove)="onMouseMove($event)"
            class="absolute top-4 left-4 pointer-events-none"
            style="max-width: 100%; height: auto;"
          >
          </canvas>
        </div>

        <!-- Game Status Messages -->
        <div class="text-center mb-6" *ngIf="gameState$ | async as gameState">
          <div
            *ngIf="gameState.gameStatus === 'won'"
            class="bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 text-success-800 dark:text-success-200 px-4 py-3 rounded-lg mb-4"
            role="alert"
            aria-live="polite"
          >
            <p class="font-semibold">🎉 Congratulations!</p>
            <p class="text-sm">
              You cleared all bubbles! Final Score: {{ gameState.score }}
            </p>
          </div>

          <div
            *ngIf="gameState.gameStatus === 'lost'"
            class="bg-danger-100 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-200 px-4 py-3 rounded-lg mb-4"
            role="alert"
            aria-live="polite"
          >
            <p class="font-semibold">😔 Game Over!</p>
            <p class="text-sm">
              The bubbles reached the shooting area. Final Score:
              {{ gameState.score }}
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
            *ngIf="gameState.gameStatus === 'playing' && gameState.score === 0"
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
              <li>• Click on the canvas to aim and shoot bubbles</li>
              <li>• Match 3 or more bubbles of the same color to clear them</li>
              <li>• You have 3 attempts to make a match</li>
              <li>• After 3 failed attempts, a new row is added</li>
              <li>• Game over when bubbles reach the shooting area</li>
              <li>• Bubbles bounce off walls</li>
            </ul>
          </div>
        </ng-container>

        <!-- Game Info -->
        <div
          class="text-center mt-8 text-sm text-secondary-500 dark:text-secondary-500"
        >
          <p>A Bubble Shooter game built with HTML5 Canvas</p>
        </div>
      </div>
    </div>
  `,
})
export class BubbleShooterComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('gameCanvas', { static: true })
  gameCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('aimingCanvas', { static: true })
  aimingCanvas!: ElementRef<HTMLCanvasElement>;

  gameState$: Observable<GameState>;
  private destroy$ = new Subject<void>();
  private gameService = inject(BubbleShooterGameService);
  private ctx!: CanvasRenderingContext2D;
  private aimingCtx!: CanvasRenderingContext2D;
  private mousePosition = { x: 0, y: 0 };

  constructor() {
    this.gameState$ = this.gameService.gameState$;
  }

  ngOnInit(): void {
    // Subscribe to game state changes to redraw canvas
    this.gameState$.pipe(takeUntil(this.destroy$)).subscribe((gameState) => {
      if (this.ctx) {
        this.drawGame(gameState);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    // Initial draw
    const initialState = this.gameService.getCurrentState();
    this.drawGame(initialState);
  }

  ngOnDestroy(): void {
    this.gameService.stopAnimations();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCanvas(): void {
    const canvas = this.gameCanvas.nativeElement;
    const aimingCanvas = this.aimingCanvas.nativeElement;

    this.ctx = canvas.getContext('2d')!;
    this.aimingCtx = aimingCanvas.getContext('2d')!;

    if (!this.ctx || !this.aimingCtx) {
      // Canvas context not available - gracefully handle the error
      return;
    }

    // Set canvas styling
    this.ctx.imageSmoothingEnabled = true;
    this.aimingCtx.imageSmoothingEnabled = true;
  }

  private drawGame(gameState: GameState): void {
    if (!this.ctx) return;

    const { canvasWidth, canvasHeight } = gameState;

    // Clear canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#E3F2FD');
    gradient.addColorStop(1, '#BBDEFB');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid bubbles
    this.drawBubbles(gameState.bubbles);

    // Draw particles (shattering effects)
    this.drawParticles(gameState.particles);

    // Draw moving bubble (during animation)
    if (gameState.movingBubble) {
      this.drawBubble(gameState.movingBubble);
    }

    // Draw current shooting bubble (when not moving)
    if (gameState.currentBubble && !gameState.movingBubble) {
      this.drawBubble(gameState.currentBubble);
    }
  }

  private drawBubbles(bubbleGrid: Bubble[][]): void {
    for (const row of bubbleGrid) {
      if (row) {
        for (const bubble of row) {
          if (bubble) {
            this.drawBubble(bubble);
          }
        }
      }
    }
  }

  private drawBubble(bubble: Bubble): void {
    const { x, y, color, radius } = bubble;

    // Draw bubble shadow
    this.ctx.beginPath();
    this.ctx.arc(x + 2, y + 2, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fill();

    // Draw bubble
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    // Draw bubble highlight
    const gradient = this.ctx.createRadialGradient(
      x - radius / 3,
      y - radius / 3,
      0,
      x - radius / 3,
      y - radius / 3,
      radius,
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw bubble border
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private drawParticles(particles: Particle[]): void {
    for (const particle of particles) {
      const alpha = 1 - particle.life / particle.maxLife;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.fill();

      // Reset alpha
      this.ctx.globalAlpha = 1;
    }
  }

  private drawAimingArrow(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): void {
    if (!this.aimingCtx) return;

    const canvasWidth = this.aimingCanvas.nativeElement.width;
    const canvasHeight = this.aimingCanvas.nativeElement.height;

    // Clear aiming canvas
    this.aimingCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate direction
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Limit the arrow length to prevent it from going too far
    const maxLength = 150;
    const actualLength = Math.min(length, maxLength);

    const unitX = dx / length;
    const unitY = dy / length;

    const arrowEndX = startX + unitX * actualLength;
    const arrowEndY = startY + unitY * actualLength;

    // Draw aiming line with gradient
    const gradient = this.aimingCtx.createLinearGradient(
      startX,
      startY,
      arrowEndX,
      arrowEndY,
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

    this.aimingCtx.beginPath();
    this.aimingCtx.moveTo(startX, startY);
    this.aimingCtx.lineTo(arrowEndX, arrowEndY);
    this.aimingCtx.strokeStyle = gradient;
    this.aimingCtx.lineWidth = 4;
    this.aimingCtx.setLineDash([]);
    this.aimingCtx.stroke();

    // Draw arrow head
    const arrowSize = 12;
    const arrowX1 = arrowEndX - arrowSize * unitX - arrowSize * 0.3 * -unitY;
    const arrowY1 = arrowEndY - arrowSize * unitY - arrowSize * 0.3 * unitX;
    const arrowX2 = arrowEndX - arrowSize * unitX + arrowSize * 0.3 * -unitY;
    const arrowY2 = arrowEndY - arrowSize * unitY + arrowSize * 0.3 * unitX;

    this.aimingCtx.beginPath();
    this.aimingCtx.moveTo(arrowEndX, arrowEndY);
    this.aimingCtx.lineTo(arrowX1, arrowY1);
    this.aimingCtx.moveTo(arrowEndX, arrowEndY);
    this.aimingCtx.lineTo(arrowX2, arrowY2);
    this.aimingCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    this.aimingCtx.lineWidth = 3;
    this.aimingCtx.stroke();

    // Draw circular indicator at the end
    this.aimingCtx.beginPath();
    this.aimingCtx.arc(arrowEndX, arrowEndY, 6, 0, 2 * Math.PI);
    this.aimingCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.aimingCtx.fill();
    this.aimingCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.aimingCtx.lineWidth = 1;
    this.aimingCtx.stroke();
  }

  onCanvasClick(event: MouseEvent): void {
    const canvas = this.gameCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    this.gameService.shootBubble(x, y);
  }

  onMouseMove(event: MouseEvent): void {
    const canvas = this.aimingCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    this.mousePosition = { x, y };

    // Draw aiming arrow from current bubble to mouse position
    const gameState = this.gameService.getCurrentState();
    if (
      gameState.currentBubble &&
      gameState.gameStatus === 'playing' &&
      !gameState.movingBubble
    ) {
      this.drawAimingArrow(
        gameState.currentBubble.x,
        gameState.currentBubble.y,
        x,
        y,
      );
    } else {
      // Clear aiming arrow when bubble is moving
      this.aimingCtx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  startNewGame(): void {
    this.gameService.startNewGame();
  }
}
