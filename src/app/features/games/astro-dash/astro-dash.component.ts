import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject,
  HostListener,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import {
  AstroDashGameService,
  GameState,
  GameObject,
  Particle,
} from './services/astro-dash-game.service';

@Component({
  selector: 'app-astro-dash',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, ButtonComponent],
  template: `
    <div
      class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200"
    >
      <div class="max-w-4xl mx-auto px-4 py-6">
        <!-- Header -->
        <header class="text-center mb-6">
          <h1
            class="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2"
          >
            🚀 Astro Dash
          </h1>
          <p class="text-body-md text-secondary-600 dark:text-secondary-400">
            Navigate through space, dodge asteroids, and collect power-ups!
          </p>
        </header>

        <!-- Game Stats -->
        <div
          class="flex flex-wrap justify-center gap-4 mb-4"
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
            class="inline-flex items-center px-4 py-2 bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg"
          >
            <span class="text-warning-800 dark:text-warning-200 font-semibold">
              Distance: {{ gameState.distance }}m
            </span>
          </div>
          <div
            class="inline-flex items-center px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 rounded-lg"
          >
            <span
              class="text-secondary-800 dark:text-secondary-200 font-semibold"
            >
              Lives: {{ gameState.lives }}
            </span>
          </div>
          <div
            *ngIf="gameState.shield > 0"
            class="inline-flex items-center px-4 py-2 bg-success-100 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg"
          >
            <span class="text-success-800 dark:text-success-200 font-semibold">
              🛡️ Shield: {{ gameState.shield }}
            </span>
          </div>
        </div>

        <!-- Game Canvas Container -->
        <div
          class="relative bg-black rounded-lg border border-secondary-200 dark:border-secondary-700 p-4 mb-6 overflow-hidden"
        >
          <canvas
            #gameCanvas
            [width]="800"
            [height]="500"
            class="block mx-auto border border-secondary-300 dark:border-secondary-600 rounded-lg cursor-crosshair bg-gradient-to-b from-slate-900 via-purple-900 to-blue-900"
            style="max-width: 100%; height: auto; background: linear-gradient(180deg, #0f172a 0%, #581c87 50%, #1e3a8a 100%);"
          >
            Your browser does not support the HTML5 canvas element.
          </canvas>

          <!-- Game Controls Overlay (only show when paused or starting) -->
          <div
            *ngIf="gameState$ | async as gameState"
            class="absolute inset-4 flex items-center justify-center"
            [class.hidden]="gameState.gameStatus === 'playing'"
          >
            <div
              class="bg-secondary-900/90 dark:bg-secondary-100/90 backdrop-blur-sm rounded-lg p-6 text-center max-w-md"
            >
              <div *ngIf="gameState.gameStatus === 'waiting'">
                <h3
                  class="text-xl font-bold text-secondary-100 dark:text-secondary-900 mb-4"
                >
                  Ready to Launch?
                </h3>
                <p
                  class="text-secondary-300 dark:text-secondary-700 mb-6 text-sm"
                >
                  Use ↑↓ Arrow Keys or W/S to navigate your ship through space.
                  Avoid asteroids and collect power-ups!
                </p>
                <app-button
                  text="Start Mission"
                  variant="primary"
                  (buttonClick)="startGame()"
                />
              </div>

              <div *ngIf="gameState.gameStatus === 'paused'">
                <h3
                  class="text-xl font-bold text-secondary-100 dark:text-secondary-900 mb-4"
                >
                  Mission Paused
                </h3>
                <div class="space-y-3">
                  <app-button
                    text="Resume"
                    variant="primary"
                    (buttonClick)="resumeGame()"
                  />
                  <app-button
                    text="New Mission"
                    variant="secondary"
                    (buttonClick)="startNewGame()"
                  />
                </div>
              </div>

              <div *ngIf="gameState.gameStatus === 'gameOver'">
                <h3
                  class="text-xl font-bold text-danger-100 dark:text-danger-900 mb-4"
                >
                  💥 Mission Failed
                </h3>
                <div class="text-secondary-300 dark:text-secondary-700 mb-6">
                  <p class="mb-2">Final Score: {{ gameState.score }}</p>
                  <p class="text-sm">
                    Distance Traveled: {{ gameState.distance }}m
                  </p>
                </div>
                <app-button
                  text="Try Again"
                  variant="primary"
                  (buttonClick)="startNewGame()"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Controls Info -->
        <div
          class="bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 mb-6"
        >
          <h3
            class="font-semibold text-secondary-900 dark:text-secondary-100 mb-3"
          >
            🎮 Controls & Objectives:
          </h3>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-700 dark:text-secondary-300"
          >
            <div>
              <h4 class="font-medium mb-2">Controls:</h4>
              <ul class="space-y-1">
                <li>• ↑/W - Move up</li>
                <li>• ↓/S - Move down</li>
                <li>• Space - Pause game</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-2">Objectives:</h4>
              <ul class="space-y-1">
                <li>• Avoid asteroids and enemy ships</li>
                <li>• Collect power-ups for bonuses</li>
                <li>• Survive as long as possible</li>
                <li>• Beat your high score!</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Power-ups Legend -->
        <div
          class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-6"
        >
          <h3
            class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4"
          >
            🌟 Power-ups
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div class="flex items-center space-x-2">
              <span class="text-lg">🛡️</span>
              <span class="text-primary-700 dark:text-primary-300">
                Shield Protection
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-lg">⚡</span>
              <span class="text-primary-700 dark:text-primary-300">
                Speed Boost
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-lg">💎</span>
              <span class="text-primary-700 dark:text-primary-300">
                Score Multiplier
              </span>
            </div>
          </div>
        </div>

        <!-- Game Info -->
        <div
          class="text-center mt-8 text-sm text-secondary-500 dark:text-secondary-500"
        >
          <p>A retro space arcade game built with HTML5 Canvas and Web Audio</p>
        </div>
      </div>
    </div>
  `,
})
export class AstroDashComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gameCanvas', { static: true })
  gameCanvas!: ElementRef<HTMLCanvasElement>;

  gameState$: Observable<GameState>;
  private destroy$ = new Subject<void>();
  private gameService = inject(AstroDashGameService);
  private ctx!: CanvasRenderingContext2D;

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
    this.gameService.stopGame();
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.gameService.handleKeyDown(event.key);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.gameService.handleKeyUp(event.key);
  }

  private initializeCanvas(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    if (!this.ctx) {
      // Canvas context not available - gracefully handle the error
      return;
    }

    // Set canvas styling for crisp graphics
    this.ctx.imageSmoothingEnabled = true;
  }

  private drawGame(gameState: GameState): void {
    if (!this.ctx) return;

    const { canvasWidth, canvasHeight } = gameState;

    // Clear canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw space background with stars
    this.drawSpaceBackground(gameState);

    // Draw all game objects
    this.drawGameObjects(gameState.gameObjects);

    // Draw particles (explosions, trails, etc.)
    this.drawParticles(gameState.particles);

    // Draw player ship
    if (gameState.player) {
      this.drawPlayer(gameState.player, gameState.shield > 0);
    }
  }

  private drawSpaceBackground(gameState: GameState): void {
    const { canvasWidth, canvasHeight } = gameState;

    // Create space gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#0f172a'); // slate-900
    gradient.addColorStop(0.5, '#581c87'); // purple-900
    gradient.addColorStop(1, '#1e3a8a'); // blue-900

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw moving stars
    gameState.stars?.forEach((star) => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  }

  private drawGameObjects(objects: GameObject[]): void {
    objects.forEach((obj) => {
      this.ctx.save();
      this.ctx.translate(obj.x, obj.y);
      this.ctx.rotate(obj.rotation || 0);

      switch (obj.type) {
        case 'asteroid':
          this.drawAsteroid(obj);
          break;
        case 'powerup':
          this.drawPowerUp(obj);
          break;
        case 'enemy':
          this.drawEnemy(obj);
          break;
      }

      this.ctx.restore();
    });
  }

  private drawPlayer(player: GameObject, hasShield: boolean): void {
    this.ctx.save();
    this.ctx.translate(player.x, player.y);

    // Draw shield effect
    if (hasShield) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, player.radius + 8, 0, 2 * Math.PI);
      this.ctx.strokeStyle = '#22c55e'; // success-500
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([5, 5]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Draw ship body (triangle pointing right)
    this.ctx.beginPath();
    this.ctx.moveTo(player.radius, 0);
    this.ctx.lineTo(-player.radius, -player.radius / 2);
    this.ctx.lineTo(-player.radius, player.radius / 2);
    this.ctx.closePath();

    // Ship gradient
    const gradient = this.ctx.createLinearGradient(
      -player.radius,
      0,
      player.radius,
      0,
    );
    gradient.addColorStop(0, '#3b82f6'); // primary-500
    gradient.addColorStop(1, '#60a5fa'); // primary-400

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.strokeStyle = '#1d4ed8'; // primary-700
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Engine glow effect
    this.ctx.beginPath();
    this.ctx.moveTo(-player.radius, 0);
    this.ctx.lineTo(-player.radius - 10, -3);
    this.ctx.lineTo(-player.radius - 15, 0);
    this.ctx.lineTo(-player.radius - 10, 3);
    this.ctx.closePath();

    const engineGradient = this.ctx.createLinearGradient(
      -player.radius,
      0,
      -player.radius - 15,
      0,
    );
    engineGradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)'); // amber-400
    engineGradient.addColorStop(1, 'rgba(249, 115, 22, 0.4)'); // orange-500

    this.ctx.fillStyle = engineGradient;
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawAsteroid(asteroid: GameObject): void {
    // Draw irregular asteroid shape
    this.ctx.beginPath();
    const sides = 8;
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 2 * Math.PI;
      const radiusVariation = asteroid.radius * (0.7 + Math.random() * 0.3);
      const x = Math.cos(angle) * radiusVariation;
      const y = Math.sin(angle) * radiusVariation;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();

    this.ctx.fillStyle = '#78716c'; // stone-500
    this.ctx.fill();
    this.ctx.strokeStyle = '#57534e'; // stone-600
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawPowerUp(powerup: GameObject): void {
    const time = Date.now() * 0.005;
    const pulse = 1 + Math.sin(time) * 0.2;

    this.ctx.scale(pulse, pulse);

    // Draw powerup based on subtype
    switch (powerup.subType) {
      case 'shield':
        this.ctx.fillStyle = '#22c55e'; // success-500
        this.ctx.strokeStyle = '#16a34a'; // success-600
        break;
      case 'speed':
        this.ctx.fillStyle = '#eab308'; // yellow-500
        this.ctx.strokeStyle = '#ca8a04'; // yellow-600
        break;
      case 'score':
        this.ctx.fillStyle = '#a855f7'; // purple-500
        this.ctx.strokeStyle = '#9333ea'; // purple-600
        break;
      default:
        this.ctx.fillStyle = '#3b82f6'; // primary-500
        this.ctx.strokeStyle = '#2563eb'; // primary-600
    }

    // Draw diamond shape
    this.ctx.beginPath();
    this.ctx.moveTo(0, -powerup.radius);
    this.ctx.lineTo(powerup.radius, 0);
    this.ctx.lineTo(0, powerup.radius);
    this.ctx.lineTo(-powerup.radius, 0);
    this.ctx.closePath();

    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Add inner glow
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fill();
  }

  private drawEnemy(enemy: GameObject): void {
    // Draw enemy ship (inverted triangle)
    this.ctx.beginPath();
    this.ctx.moveTo(-enemy.radius, 0);
    this.ctx.lineTo(enemy.radius, -enemy.radius / 2);
    this.ctx.lineTo(enemy.radius, enemy.radius / 2);
    this.ctx.closePath();

    this.ctx.fillStyle = '#dc2626'; // danger-600
    this.ctx.fill();
    this.ctx.strokeStyle = '#991b1b'; // danger-800
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawParticles(particles: Particle[]): void {
    particles.forEach((particle) => {
      const alpha = 1 - particle.life / particle.maxLife;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  startGame(): void {
    this.gameService.startGame();
  }

  startNewGame(): void {
    this.gameService.startNewGame();
  }

  resumeGame(): void {
    this.gameService.resumeGame();
  }
}
