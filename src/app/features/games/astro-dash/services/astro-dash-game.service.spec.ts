import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AstroDashGameService } from './astro-dash-game.service';

describe('AstroDashGameService', () => {
  let service: AstroDashGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(AstroDashGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with waiting state', () => {
    const initialState = service.getCurrentState();

    expect(initialState.gameStatus).toBe('waiting');
    expect(initialState.score).toBe(0);
    expect(initialState.distance).toBe(0);
    expect(initialState.lives).toBe(3);
    expect(initialState.shield).toBe(0);
    expect(initialState.speed).toBe(1);
    expect(initialState.player).toBeTruthy();
    expect(initialState.gameObjects).toEqual([]);
    expect(initialState.particles).toEqual([]);
    expect(initialState.stars.length).toBeGreaterThan(0);
  });

  it('should create player with correct initial properties', () => {
    const initialState = service.getCurrentState();
    const player = initialState.player;

    expect(player).toBeTruthy();
    expect(player!.id).toBe('player');
    expect(player!.type).toBe('player');
    expect(player!.x).toBe(100);
    expect(player!.y).toBe(250); // canvasHeight / 2
    expect(player!.radius).toBe(15);
    expect(player!.velocityX).toBe(0);
    expect(player!.velocityY).toBe(0);
  });

  it('should generate stars for background', () => {
    const initialState = service.getCurrentState();
    const stars = initialState.stars;

    expect(stars.length).toBe(100);

    stars.forEach((star) => {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(800);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(500);
      expect(star.size).toBeGreaterThan(0);
      expect(star.opacity).toBeGreaterThan(0);
      expect(star.speed).toBeGreaterThan(0);
    });
  });

  it('should start game and change status to playing', () => {
    service.startGame();
    const state = service.getCurrentState();

    expect(state.gameStatus).toBe('playing');
  });

  it('should start new game and reset state', () => {
    // First modify the state
    service.startGame();
    let state = service.getCurrentState();
    state.score = 1000;
    state.lives = 1;

    // Start new game
    service.startNewGame();
    state = service.getCurrentState();

    expect(state.gameStatus).toBe('playing');
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.distance).toBe(0);
  });

  it('should handle key presses correctly', () => {
    service.handleKeyDown('ArrowUp');
    service.handleKeyDown('w');
    service.handleKeyDown(' '); // space for pause

    // Keys should be stored internally (tested through game behavior)
    expect(service).toBeTruthy(); // Basic check since keys are private
  });

  it('should pause and resume game correctly', () => {
    service.startGame();

    // Pause game
    service.handleKeyDown(' ');
    let state = service.getCurrentState();
    expect(state.gameStatus).toBe('paused');

    // Resume game
    service.resumeGame();
    state = service.getCurrentState();
    expect(state.gameStatus).toBe('playing');
  });

  it('should stop game and clear state', () => {
    service.startGame();
    service.stopGame();

    // Game should stop (loop stopped, keys cleared)
    expect(service).toBeTruthy(); // Basic check since internals are private
  });

  describe('Game State Observable', () => {
    it('should emit initial state', (done) => {
      service.gameState$.subscribe((state) => {
        expect(state.gameStatus).toBe('waiting');
        expect(state.score).toBe(0);
        done();
      });
    });

    it('should emit state changes', (done) => {
      let emissionCount = 0;

      service.gameState$.subscribe((state) => {
        emissionCount++;

        if (emissionCount === 1) {
          expect(state.gameStatus).toBe('waiting');
        } else if (emissionCount === 2) {
          expect(state.gameStatus).toBe('playing');
          done();
        }
      });

      service.startGame();
    });
  });

  describe('Canvas Dimensions', () => {
    it('should have correct canvas dimensions', () => {
      const state = service.getCurrentState();

      expect(state.canvasWidth).toBe(800);
      expect(state.canvasHeight).toBe(500);
    });
  });

  describe('Difficulty and Progression', () => {
    it('should start with difficulty 1', () => {
      const state = service.getCurrentState();
      expect(state.difficulty).toBe(1);
    });

    it('should have initial powerup timer', () => {
      const state = service.getCurrentState();
      expect(state.powerupTimer).toBe(0);
    });
  });

  describe('Game Objects', () => {
    it('should start with empty game objects array', () => {
      const state = service.getCurrentState();
      expect(state.gameObjects).toEqual([]);
    });

    it('should start with empty particles array', () => {
      const state = service.getCurrentState();
      expect(state.particles).toEqual([]);
    });
  });

  describe('Player Properties', () => {
    it('should have player at correct starting position', () => {
      const state = service.getCurrentState();
      const player = state.player;

      expect(player!.x).toBe(100);
      expect(player!.y).toBe(250);
    });

    it('should have player with correct radius', () => {
      const state = service.getCurrentState();
      const player = state.player;

      expect(player!.radius).toBe(15);
    });
  });

  describe('Audio Context', () => {
    it('should handle audio initialization gracefully', () => {
      // Audio context initialization happens in constructor
      // Should not throw errors even if Web Audio API is not supported
      expect(service).toBeTruthy();
    });
  });

  describe('Key Management', () => {
    it('should handle key up and down events', () => {
      // These methods should not throw errors
      service.handleKeyDown('ArrowUp');
      service.handleKeyUp('ArrowUp');
      service.handleKeyDown('w');
      service.handleKeyUp('w');
      service.handleKeyDown(' ');
      service.handleKeyUp(' ');

      expect(service).toBeTruthy();
    });
  });

  describe('Game Status Transitions', () => {
    it('should transition from waiting to playing', () => {
      expect(service.getCurrentState().gameStatus).toBe('waiting');

      service.startGame();
      expect(service.getCurrentState().gameStatus).toBe('playing');
    });

    it('should transition from playing to paused via space key', () => {
      service.startGame();
      expect(service.getCurrentState().gameStatus).toBe('playing');

      service.handleKeyDown(' ');
      expect(service.getCurrentState().gameStatus).toBe('paused');
    });

    it('should transition from paused to playing via space key', () => {
      service.startGame();
      service.handleKeyDown(' '); // pause
      expect(service.getCurrentState().gameStatus).toBe('paused');

      service.handleKeyDown(' '); // resume
      expect(service.getCurrentState().gameStatus).toBe('playing');
    });
  });
});
