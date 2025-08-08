import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameObject {
  id: string;
  type: 'player' | 'asteroid' | 'powerup' | 'enemy';
  subType?: string;
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  rotation?: number;
  rotationSpeed?: number;
}

export interface Particle {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export interface GameState {
  gameStatus: 'waiting' | 'playing' | 'paused' | 'gameOver';
  score: number;
  distance: number;
  lives: number;
  shield: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
  player: GameObject | null;
  gameObjects: GameObject[];
  particles: Particle[];
  stars: Star[];
  difficulty: number;
  powerupTimer: number;
}

interface SoundEffect {
  frequency: number;
  duration: number;
  type: 'sine' | 'square' | 'sawtooth' | 'triangle';
  volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class AstroDashGameService {
  private gameStateSubject = new BehaviorSubject<GameState>(
    this.createInitialState(),
  );
  public gameState$ = this.gameStateSubject.asObservable();

  private gameLoop: number | null = null;
  private lastTime = 0;
  private keys = new Set<string>();
  private audioContext: AudioContext | null = null;

  // Game constants
  private readonly CANVAS_WIDTH = 800;
  private readonly CANVAS_HEIGHT = 500;
  private readonly PLAYER_SPEED = 5;
  private readonly SCROLL_SPEED = 2;
  private readonly SPAWN_RATES = {
    asteroid: 0.02,
    enemy: 0.005,
    powerup: 0.003,
  };

  constructor() {
    this.initializeAudio();
  }

  private createInitialState(): GameState {
    return {
      gameStatus: 'waiting',
      score: 0,
      distance: 0,
      lives: 3,
      shield: 0,
      speed: 1,
      canvasWidth: 800,
      canvasHeight: 500,
      player: this.createPlayer(),
      gameObjects: [],
      particles: [],
      stars: this.generateStars(),
      difficulty: 1,
      powerupTimer: 0,
    };
  }

  private createPlayer(): GameObject {
    return {
      id: 'player',
      type: 'player',
      x: 100,
      y: 250, // Hard-coded instead of this.CANVAS_HEIGHT / 2 for test reliability
      radius: 15,
      velocityX: 0,
      velocityY: 0,
    };
  }

  private generateStars(): Star[] {
    const stars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * 800, // Hard-coded values for test reliability
        y: Math.random() * 500,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 2 + 1,
      });
    }
    return stars;
  }

  private initializeAudio(): void {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch {
      // Web Audio API not supported - silently ignore
    }
  }

  getCurrentState(): GameState {
    return this.gameStateSubject.value;
  }

  startGame(): void {
    const currentState = this.getCurrentState();
    if (currentState.gameStatus === 'waiting') {
      this.updateGameState({
        ...currentState,
        gameStatus: 'playing',
      });
      this.startGameLoop();
      this.playSound({
        frequency: 220,
        duration: 200,
        type: 'sine',
        volume: 0.3,
      });
    }
  }

  startNewGame(): void {
    this.stopGameLoop();
    const newState = this.createInitialState();
    newState.gameStatus = 'playing';
    this.updateGameState(newState);
    this.startGameLoop();
    this.playSound({
      frequency: 220,
      duration: 200,
      type: 'sine',
      volume: 0.3,
    });
  }

  resumeGame(): void {
    const currentState = this.getCurrentState();
    if (currentState.gameStatus === 'paused') {
      this.updateGameState({
        ...currentState,
        gameStatus: 'playing',
      });
      this.startGameLoop();
    }
  }

  pauseGame(): void {
    const currentState = this.getCurrentState();
    if (currentState.gameStatus === 'playing') {
      this.updateGameState({
        ...currentState,
        gameStatus: 'paused',
      });
      this.stopGameLoop();
      this.playSound({
        frequency: 150,
        duration: 100,
        type: 'square',
        volume: 0.2,
      });
    }
  }

  stopGame(): void {
    this.stopGameLoop();
    this.keys.clear();
  }

  handleKeyDown(key: string): void {
    this.keys.add(key.toLowerCase());

    // Handle pause
    if (key === ' ') {
      const currentState = this.getCurrentState();
      if (currentState.gameStatus === 'playing') {
        this.pauseGame();
      } else if (currentState.gameStatus === 'paused') {
        this.resumeGame();
      }
    }
  }

  handleKeyUp(key: string): void {
    this.keys.delete(key.toLowerCase());
  }

  private startGameLoop(): void {
    if (this.gameLoop) return;

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      if (deltaTime < 100) {
        // Prevent large jumps
        this.updateGame(deltaTime);
      }

      const currentState = this.getCurrentState();
      if (currentState.gameStatus === 'playing') {
        this.gameLoop = requestAnimationFrame(loop);
      } else {
        this.gameLoop = null;
      }
    };

    this.gameLoop = requestAnimationFrame(loop);
  }

  private stopGameLoop(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  private updateGame(deltaTime: number): void {
    const currentState = this.getCurrentState();
    const updatedState = { ...currentState };

    // Update player movement
    this.updatePlayerMovement(updatedState);

    // Update stars (scrolling background)
    this.updateStars(updatedState);

    // Spawn new objects
    this.spawnObjects(updatedState);

    // Update all game objects
    this.updateGameObjects(updatedState);

    // Update particles
    this.updateParticles(updatedState, deltaTime);

    // Check collisions
    this.checkCollisions(updatedState);

    // Update game progression
    this.updateProgression(updatedState, deltaTime);

    // Check game over condition
    this.checkGameOver(updatedState);

    this.updateGameState(updatedState);
  }

  private updatePlayerMovement(state: GameState): void {
    if (!state.player) return;

    const player = state.player;
    const moveSpeed = 5 * state.speed; // Using hard-coded PLAYER_SPEED value

    // Handle vertical movement
    if (this.keys.has('arrowup') || this.keys.has('w')) {
      player.velocityY = -moveSpeed;
    } else if (this.keys.has('arrowdown') || this.keys.has('s')) {
      player.velocityY = moveSpeed;
    } else {
      player.velocityY *= 0.9; // Gradual stop
    }

    // Update position
    player.y += player.velocityY;

    // Keep player within bounds
    const margin = player.radius;
    player.y = Math.max(
      margin,
      Math.min(state.canvasHeight - margin, player.y),
    );
  }

  private updateStars(state: GameState): void {
    state.stars.forEach((star) => {
      star.x -= star.speed * state.speed;
      if (star.x < 0) {
        star.x = state.canvasWidth;
        star.y = Math.random() * state.canvasHeight;
      }
    });
  }

  private spawnObjects(state: GameState): void {
    const spawnX = state.canvasWidth + 50;

    // Spawn asteroids
    if (Math.random() < 0.02 * state.difficulty) {
      // Using hard-coded spawn rate
      const asteroid: GameObject = {
        id: 'asteroid_' + Date.now() + '_' + Math.random(),
        type: 'asteroid',
        x: spawnX,
        y: Math.random() * (state.canvasHeight - 100) + 50,
        radius: Math.random() * 20 + 15,
        velocityX: -(Math.random() * 2 + 2) * state.speed,
        velocityY: (Math.random() - 0.5) * 2,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      };
      state.gameObjects.push(asteroid);
    }

    // Spawn enemies (less frequent)
    if (Math.random() < 0.005 * state.difficulty) {
      // Using hard-coded spawn rate
      const enemy: GameObject = {
        id: 'enemy_' + Date.now() + '_' + Math.random(),
        type: 'enemy',
        x: spawnX,
        y: Math.random() * (state.canvasHeight - 100) + 50,
        radius: 12,
        velocityX: -(Math.random() * 3 + 3) * state.speed,
        velocityY: (Math.random() - 0.5) * 3,
      };
      state.gameObjects.push(enemy);
    }

    // Spawn power-ups (rare)
    if (Math.random() < 0.003) {
      // Using hard-coded spawn rate
      const powerupTypes = ['shield', 'speed', 'score'];
      const powerupType =
        powerupTypes[Math.floor(Math.random() * powerupTypes.length)];

      const powerup: GameObject = {
        id: 'powerup_' + Date.now() + '_' + Math.random(),
        type: 'powerup',
        subType: powerupType,
        x: spawnX,
        y: Math.random() * (state.canvasHeight - 100) + 50,
        radius: 10,
        velocityX: -2 * state.speed,
        velocityY: Math.sin(Date.now() * 0.002) * 2,
      };
      state.gameObjects.push(powerup);
    }
  }

  private updateGameObjects(state: GameState): void {
    // Update positions and remove off-screen objects
    state.gameObjects = state.gameObjects.filter((obj) => {
      // Update position
      obj.x += obj.velocityX;
      obj.y += obj.velocityY;

      // Update rotation
      if (obj.rotationSpeed) {
        obj.rotation = (obj.rotation || 0) + obj.rotationSpeed;
      }

      // Add slight vertical oscillation to power-ups
      if (obj.type === 'powerup') {
        obj.y += Math.sin(Date.now() * 0.005) * 0.5;
      }

      // Keep objects within vertical bounds (bounce)
      if (obj.y < obj.radius || obj.y > state.canvasHeight - obj.radius) {
        obj.velocityY *= -0.8;
        obj.y = Math.max(
          obj.radius,
          Math.min(state.canvasHeight - obj.radius, obj.y),
        );
      }

      // Remove objects that are off-screen
      return obj.x > -50;
    });
  }

  private updateParticles(state: GameState, deltaTime: number): void {
    state.particles = state.particles.filter((particle) => {
      // Update position
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      // Update life
      particle.life += deltaTime;

      // Apply gravity to particles
      particle.velocityY += 0.1;

      return particle.life < particle.maxLife;
    });
  }

  private checkCollisions(state: GameState): void {
    if (!state.player) return;

    const player = state.player;

    state.gameObjects.forEach((obj) => {
      const distance = Math.sqrt(
        (player.x - obj.x) ** 2 + (player.y - obj.y) ** 2,
      );

      if (distance < player.radius + obj.radius) {
        this.handleCollision(state, obj);
      }
    });
  }

  private handleCollision(state: GameState, obj: GameObject): void {
    switch (obj.type) {
      case 'asteroid':
      case 'enemy':
        this.handleDamage(state, obj);
        break;
      case 'powerup':
        this.handlePowerup(state, obj);
        break;
    }

    // Remove the object after collision
    state.gameObjects = state.gameObjects.filter((o) => o.id !== obj.id);
  }

  private handleDamage(state: GameState, obj: GameObject): void {
    if (state.shield > 0) {
      // Shield absorbs damage
      state.shield--;
      this.playSound({
        frequency: 400,
        duration: 150,
        type: 'square',
        volume: 0.4,
      });

      // Create shield particles
      this.createParticles(state, obj.x, obj.y, '#22c55e', 8);
    } else {
      // Player takes damage
      state.lives--;
      this.playSound({
        frequency: 150,
        duration: 300,
        type: 'sawtooth',
        volume: 0.5,
      });

      // Create explosion particles
      this.createParticles(state, obj.x, obj.y, '#ef4444', 12);
    }
  }

  private handlePowerup(state: GameState, powerup: GameObject): void {
    switch (powerup.subType) {
      case 'shield':
        state.shield = Math.min(state.shield + 3, 5);
        this.playSound({
          frequency: 600,
          duration: 200,
          type: 'sine',
          volume: 0.4,
        });
        break;
      case 'speed':
        state.speed = Math.min(state.speed + 0.5, 3);
        this.playSound({
          frequency: 800,
          duration: 150,
          type: 'triangle',
          volume: 0.4,
        });
        break;
      case 'score':
        state.score += 100;
        this.playSound({
          frequency: 1000,
          duration: 200,
          type: 'sine',
          volume: 0.4,
        });
        break;
    }

    // Create collection particles
    this.createParticles(state, powerup.x, powerup.y, '#a855f7', 6);
  }

  private createParticles(
    state: GameState,
    x: number,
    y: number,
    color: string,
    count: number,
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 5 + 2;

      state.particles.push({
        x,
        y,
        radius: Math.random() * 3 + 1,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color,
        life: 0,
        maxLife: 1000 + Math.random() * 500,
      });
    }
  }

  private updateProgression(state: GameState, deltaTime: number): void {
    // Update distance and score
    state.distance += Math.floor(2 * state.speed); // Using hard-coded SCROLL_SPEED value
    state.score += Math.floor(state.speed);

    // Gradually increase difficulty
    state.difficulty = 1 + state.distance / 1000;

    // Reduce shield over time
    state.powerupTimer += deltaTime;
    if (state.powerupTimer > 10000) {
      // Every 10 seconds
      if (state.shield > 0) {
        state.shield = Math.max(0, state.shield - 1);
      }
      state.powerupTimer = 0;
    }

    // Gradually reduce speed boost
    if (state.speed > 1) {
      state.speed = Math.max(1, state.speed - 0.005);
    }
  }

  private checkGameOver(state: GameState): void {
    if (state.lives <= 0) {
      state.gameStatus = 'gameOver';
      this.stopGameLoop();
      this.playSound({
        frequency: 100,
        duration: 500,
        type: 'sawtooth',
        volume: 0.6,
      });
    }
  }

  private playSound(sound: SoundEffect): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(
        sound.frequency,
        this.audioContext.currentTime,
      );

      gainNode.gain.setValueAtTime(sound.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + sound.duration / 1000,
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration / 1000);
    } catch {
      // Error playing sound - silently ignore
    }
  }

  private updateGameState(newState: GameState): void {
    this.gameStateSubject.next(newState);
  }
}
