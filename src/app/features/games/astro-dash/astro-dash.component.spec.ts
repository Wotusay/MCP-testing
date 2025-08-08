import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

import { AstroDashComponent } from './astro-dash.component';
import {
  AstroDashGameService,
  GameState,
} from './services/astro-dash-game.service';
import { BehaviorSubject } from 'rxjs';

describe('AstroDashComponent', () => {
  let component: AstroDashComponent;
  let fixture: ComponentFixture<AstroDashComponent>;
  let mockGameService: jasmine.SpyObj<AstroDashGameService>;
  let gameStateSubject: BehaviorSubject<GameState>;

  const mockInitialState: GameState = {
    gameStatus: 'waiting',
    score: 0,
    distance: 0,
    lives: 3,
    shield: 0,
    speed: 1,
    canvasWidth: 800,
    canvasHeight: 500,
    player: {
      id: 'player',
      type: 'player',
      x: 100,
      y: 250,
      radius: 15,
      velocityX: 0,
      velocityY: 0,
    },
    gameObjects: [],
    particles: [],
    stars: [],
    difficulty: 1,
    powerupTimer: 0,
  };

  beforeEach(async () => {
    gameStateSubject = new BehaviorSubject<GameState>(mockInitialState);

    mockGameService = jasmine.createSpyObj('AstroDashGameService', [
      'startGame',
      'startNewGame',
      'resumeGame',
      'stopGame',
      'handleKeyDown',
      'handleKeyUp',
      'getCurrentState',
    ]);

    mockGameService.gameState$ = gameStateSubject.asObservable();
    mockGameService.getCurrentState.and.returnValue(mockInitialState);

    await TestBed.configureTestingModule({
      imports: [AstroDashComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AstroDashGameService, useValue: mockGameService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AstroDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display game title and description', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    const descriptionElement = fixture.debugElement.query(By.css('p'));

    expect(titleElement.nativeElement.textContent).toContain('🚀 Astro Dash');
    expect(descriptionElement.nativeElement.textContent).toContain(
      'Navigate through space, dodge asteroids, and collect power-ups!',
    );
  });

  it('should display game stats correctly', () => {
    // Check the content using class selectors
    const statsElements = fixture.debugElement.queryAll(
      By.css('.inline-flex span'),
    );

    expect(
      statsElements.some((el) =>
        el.nativeElement.textContent.includes('Score: 0'),
      ),
    ).toBeTruthy();
    expect(
      statsElements.some((el) =>
        el.nativeElement.textContent.includes('Distance: 0m'),
      ),
    ).toBeTruthy();
    expect(
      statsElements.some((el) =>
        el.nativeElement.textContent.includes('Lives: 3'),
      ),
    ).toBeTruthy();
  });

  it('should show start button when game is waiting', () => {
    const startButton = fixture.debugElement.query(
      By.css('app-button[text="Start Mission"]'),
    );
    expect(startButton).toBeTruthy();
  });

  it('should call startGame when start button is clicked', () => {
    const startButton = fixture.debugElement.query(
      By.css('app-button[text="Start Mission"]'),
    );

    startButton.triggerEventHandler('buttonClick', null);

    expect(mockGameService.startGame).toHaveBeenCalled();
  });

  it('should show pause controls when game is paused', () => {
    const pausedState: GameState = {
      ...mockInitialState,
      gameStatus: 'paused',
    };
    gameStateSubject.next(pausedState);
    fixture.detectChanges();

    const resumeButton = fixture.debugElement.query(
      By.css('app-button[text="Resume"]'),
    );
    const newGameButton = fixture.debugElement.query(
      By.css('app-button[text="New Mission"]'),
    );

    expect(resumeButton).toBeTruthy();
    expect(newGameButton).toBeTruthy();
  });

  it('should show game over state correctly', () => {
    const gameOverState: GameState = {
      ...mockInitialState,
      gameStatus: 'gameOver',
      score: 1500,
    };
    gameStateSubject.next(gameOverState);
    fixture.detectChanges();

    const gameOverTitle = fixture.debugElement.query(By.css('h3'));
    const tryAgainButton = fixture.debugElement.query(
      By.css('app-button[text="Try Again"]'),
    );

    expect(gameOverTitle.nativeElement.textContent).toContain(
      '💥 Mission Failed',
    );
    expect(tryAgainButton).toBeTruthy();
  });

  it('should display shield status when player has shield', () => {
    const shieldState: GameState = { ...mockInitialState, shield: 3 };
    gameStateSubject.next(shieldState);
    fixture.detectChanges();

    const shieldElement = fixture.debugElement.query(By.css('.bg-success-100'));

    expect(shieldElement).toBeTruthy();
    expect(shieldElement.nativeElement.textContent).toContain('🛡️ Shield: 3');
  });

  it('should not display shield status when shield is 0', () => {
    const noShieldState: GameState = { ...mockInitialState, shield: 0 };
    gameStateSubject.next(noShieldState);
    fixture.detectChanges();

    const shieldElement = fixture.debugElement.query(By.css('.bg-success-100'));

    expect(shieldElement).toBeFalsy();
  });

  it('should handle keyboard events correctly', () => {
    const keyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const keyUpEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });

    component.onKeyDown(keyDownEvent);
    component.onKeyUp(keyUpEvent);

    expect(mockGameService.handleKeyDown).toHaveBeenCalledWith('ArrowUp');
    expect(mockGameService.handleKeyUp).toHaveBeenCalledWith('ArrowUp');
  });

  it('should prevent default behavior for game control keys when game is active', () => {
    // Set game to playing state
    const playingState = {
      ...mockInitialState,
      gameStatus: 'playing' as const,
    };
    gameStateSubject.next(playingState);
    mockGameService.getCurrentState.and.returnValue(playingState);

    const gameControlKeys = ['ArrowUp', 'ArrowDown', 'w', 's', ' '];

    gameControlKeys.forEach((key) => {
      const keyDownEvent = new KeyboardEvent('keydown', { key });
      const preventDefaultSpy = spyOn(keyDownEvent, 'preventDefault');

      component.onKeyDown(keyDownEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  it('should prevent default behavior for game control keys when game is paused', () => {
    // Set game to paused state
    const pausedState = { ...mockInitialState, gameStatus: 'paused' as const };
    gameStateSubject.next(pausedState);
    mockGameService.getCurrentState.and.returnValue(pausedState);

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const preventDefaultSpy = spyOn(keyDownEvent, 'preventDefault');

    component.onKeyDown(keyDownEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not prevent default behavior for game control keys when game is waiting', () => {
    // Game is in waiting state (default mock state)
    const keyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const preventDefaultSpy = spyOn(keyDownEvent, 'preventDefault');

    component.onKeyDown(keyDownEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should not prevent default behavior for non-game control keys', () => {
    // Set game to playing state
    const playingState = {
      ...mockInitialState,
      gameStatus: 'playing' as const,
    };
    gameStateSubject.next(playingState);
    mockGameService.getCurrentState.and.returnValue(playingState);

    const nonGameKeys = ['Enter', 'Escape', 'Tab', 'a', 'z'];

    nonGameKeys.forEach((key) => {
      const keyDownEvent = new KeyboardEvent('keydown', { key });
      const preventDefaultSpy = spyOn(keyDownEvent, 'preventDefault');

      component.onKeyDown(keyDownEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  it('should have canvas element with correct dimensions', () => {
    const canvas = fixture.debugElement.query(By.css('canvas'));

    expect(canvas).toBeTruthy();
    expect(canvas.nativeElement.width).toBe(800);
    expect(canvas.nativeElement.height).toBe(500);
  });

  it('should call resumeGame when resume button is clicked', () => {
    const pausedState: GameState = {
      ...mockInitialState,
      gameStatus: 'paused',
    };
    gameStateSubject.next(pausedState);
    fixture.detectChanges();

    const resumeButton = fixture.debugElement.query(
      By.css('app-button[text="Resume"]'),
    );

    resumeButton.triggerEventHandler('buttonClick', null);

    expect(mockGameService.resumeGame).toHaveBeenCalled();
  });

  it('should call startNewGame when new game button is clicked', () => {
    const pausedState: GameState = {
      ...mockInitialState,
      gameStatus: 'paused',
    };
    gameStateSubject.next(pausedState);
    fixture.detectChanges();

    const newGameButton = fixture.debugElement.query(
      By.css('app-button[text="New Mission"]'),
    );

    newGameButton.triggerEventHandler('buttonClick', null);

    expect(mockGameService.startNewGame).toHaveBeenCalled();
  });

  it('should call startNewGame when try again button is clicked', () => {
    const gameOverState: GameState = {
      ...mockInitialState,
      gameStatus: 'gameOver',
    };
    gameStateSubject.next(gameOverState);
    fixture.detectChanges();

    const tryAgainButton = fixture.debugElement.query(
      By.css('app-button[text="Try Again"]'),
    );

    tryAgainButton.triggerEventHandler('buttonClick', null);

    expect(mockGameService.startNewGame).toHaveBeenCalled();
  });

  it('should hide overlay when game is playing', () => {
    const playingState: GameState = {
      ...mockInitialState,
      gameStatus: 'playing',
    };
    gameStateSubject.next(playingState);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.absolute.inset-4'));

    expect(overlay.nativeElement.classList).toContain('hidden');
  });

  it('should display controls and objectives information', () => {
    const controlsSection = fixture.debugElement.query(By.css('h3'));

    const controlElements = fixture.debugElement.queryAll(By.css('li'));
    const hasUpDownControls = controlElements.some(
      (el) =>
        el.nativeElement.textContent.includes('↑/W - Move up') ||
        el.nativeElement.textContent.includes('↓/S - Move down'),
    );

    expect(controlsSection).toBeTruthy();
    expect(hasUpDownControls).toBeTruthy();
  });

  it('should display power-ups legend', () => {
    const powerupsSection = fixture.debugElement.queryAll(By.css('h3'));
    const powerupsTitle = powerupsSection.find((el) =>
      el.nativeElement.textContent.includes('🌟 Power-ups'),
    );

    expect(powerupsTitle).toBeTruthy();

    const powerupItems = fixture.debugElement.queryAll(
      By.css('.flex.items-center.space-x-2'),
    );
    expect(powerupItems.length).toBeGreaterThan(0);
  });

  it('should cleanup on destroy', () => {
    spyOn(component, 'ngOnDestroy').and.callThrough();

    fixture.destroy();

    expect(mockGameService.stopGame).toHaveBeenCalled();
  });
});
