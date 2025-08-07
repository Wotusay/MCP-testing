import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Bubble {
  x: number;
  y: number;
  color: string;
  radius: number;
}

export interface MovingBubble extends Bubble {
  dx: number;
  dy: number;
  targetX?: number;
  targetY?: number;
}

export interface GameState {
  bubbles: Bubble[][];
  currentBubble: Bubble | null;
  movingBubble: MovingBubble | null;
  score: number;
  gameStatus: 'playing' | 'won' | 'lost';
  rows: number;
  cols: number;
  canvasWidth: number;
  canvasHeight: number;
  attemptsLeft: number;
  maxAttempts: number;
}

export interface Position {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class BubbleShooterGameService {
  private readonly COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FECA57',
    '#FF9FF3',
  ];
  private readonly BUBBLE_RADIUS = 20;
  private readonly CANVAS_WIDTH = 400;
  private readonly CANVAS_HEIGHT = 600;
  private readonly GRID_ROWS = 16;
  private readonly GRID_COLS = 16;
  private readonly MAX_ATTEMPTS = 3;
  private readonly ANIMATION_SPEED = 8;

  private gameState = new BehaviorSubject<GameState>(this.createInitialState());
  public gameState$ = this.gameState.asObservable();
  private animationFrameId: number | null = null;

  constructor() {
    this.initializeGame();
  }

  private createInitialState(): GameState {
    return {
      bubbles: [],
      currentBubble: null,
      movingBubble: null,
      score: 0,
      gameStatus: 'playing',
      rows: this.GRID_ROWS,
      cols: this.GRID_COLS,
      canvasWidth: this.CANVAS_WIDTH,
      canvasHeight: this.CANVAS_HEIGHT,
      attemptsLeft: this.MAX_ATTEMPTS,
      maxAttempts: this.MAX_ATTEMPTS,
    };
  }

  private initializeGame(): void {
    const state = this.createInitialState();

    // Initialize bubble grid
    state.bubbles = this.createBubbleGrid();

    // Create first shooting bubble
    state.currentBubble = this.createNewBubble();

    this.gameState.next(state);
  }

  private createBubbleGrid(): Bubble[][] {
    const grid: Bubble[][] = [];
    const bubbleSize = this.BUBBLE_RADIUS * 2;
    const offsetX = this.BUBBLE_RADIUS;
    const offsetY = this.BUBBLE_RADIUS;

    for (let row = 0; row < 6; row++) {
      // Start with 6 rows
      grid[row] = [];
      for (let col = 0; col < this.GRID_COLS; col++) {
        // Offset every other row for honeycomb pattern
        const xOffset = (row % 2) * this.BUBBLE_RADIUS;
        const x = offsetX + col * bubbleSize + xOffset;
        const y = offsetY + row * (bubbleSize * 0.866); // 0.866 for hexagonal spacing

        if (x + this.BUBBLE_RADIUS <= this.CANVAS_WIDTH) {
          const color = this.getRandomColor();
          grid[row][col] = {
            x,
            y,
            color,
            radius: this.BUBBLE_RADIUS,
          };
        }
      }
    }

    return grid;
  }

  private createNewBubble(): Bubble {
    return {
      x: this.CANVAS_WIDTH / 2,
      y: this.CANVAS_HEIGHT - 50,
      color: this.getRandomColor(),
      radius: this.BUBBLE_RADIUS,
    };
  }

  private getRandomColor(): string {
    // Get colors that are currently on the board
    const availableColors = this.getAvailableColors();

    // If no colors available on board (empty board), use all colors
    if (availableColors.length === 0) {
      return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    }

    // Otherwise, only use colors that exist on the board
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  private getAvailableColors(): string[] {
    const currentState = this.gameState.value;
    const colorsOnBoard = new Set<string>();

    // Scan all bubbles in the grid to find existing colors
    for (const row of currentState.bubbles) {
      if (row) {
        for (const bubble of row) {
          if (bubble) {
            colorsOnBoard.add(bubble.color);
          }
        }
      }
    }

    return Array.from(colorsOnBoard);
  }

  public shootBubble(targetX: number, targetY: number): void {
    const currentState = this.gameState.value;
    if (
      currentState.gameStatus !== 'playing' ||
      !currentState.currentBubble ||
      currentState.movingBubble
    ) {
      return;
    }

    // Create moving bubble with trajectory
    const bubble = currentState.currentBubble;
    const trajectory = this.calculateTrajectory(bubble, targetX, targetY);

    const movingBubble: MovingBubble = {
      ...bubble,
      dx: trajectory.dx,
      dy: trajectory.dy,
    };

    // Start animation
    currentState.movingBubble = movingBubble;
    currentState.currentBubble = null; // Hide current bubble during animation

    this.gameState.next(currentState);
    this.startBubbleAnimation();
  }

  private startBubbleAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = () => {
      const currentState = this.gameState.value;
      const movingBubble = currentState.movingBubble;

      if (!movingBubble || currentState.gameStatus !== 'playing') {
        return;
      }

      // Update bubble position
      movingBubble.x += movingBubble.dx;
      movingBubble.y += movingBubble.dy;

      // Check wall bouncing
      if (
        movingBubble.x <= this.BUBBLE_RADIUS ||
        movingBubble.x >= this.CANVAS_WIDTH - this.BUBBLE_RADIUS
      ) {
        movingBubble.dx *= -1;
      }

      // Check collision with existing bubbles or top boundary
      const collision = this.checkBubbleCollision(
        movingBubble.x,
        movingBubble.y,
        currentState.bubbles,
      );
      const reachedTop = movingBubble.y <= this.BUBBLE_RADIUS;

      if (collision || reachedTop) {
        // Stop animation and place bubble
        this.placeBubbleAfterAnimation(movingBubble, currentState);
        return;
      }

      // Continue animation
      this.gameState.next(currentState);
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private placeBubbleAfterAnimation(
    movingBubble: MovingBubble,
    state: GameState,
  ): void {
    // Find the best grid position for the bubble
    const gridPosition = this.getGridPosition({
      x: movingBubble.x,
      y: movingBubble.y,
    });

    let madeMatch = false;

    if (gridPosition && this.isValidGridPosition(gridPosition, state.bubbles)) {
      // Place bubble in grid
      this.placeBubbleInGrid(gridPosition, movingBubble.color, state);

      // Check for matches only if bubble was successfully placed
      const matchedBubbles = this.findMatches(gridPosition, state.bubbles);

      if (matchedBubbles.length >= 3) {
        this.removeBubbles(matchedBubbles, state);
        state.score += matchedBubbles.length * 10;
        madeMatch = true;
        // Reset attempts on successful match
        state.attemptsLeft = this.MAX_ATTEMPTS;
      }
    }

    // If no match was made, decrement attempts
    // This includes both cases: bubble couldn't be placed OR bubble was placed but no match
    if (!madeMatch) {
      state.attemptsLeft--;

      // Add new row if attempts exhausted
      if (state.attemptsLeft <= 0) {
        this.addNewRow(state);
        // Only reset attempts if game didn't end due to adding row
        if (state.gameStatus === 'playing') {
          state.attemptsLeft = this.MAX_ATTEMPTS;
        }
      }
    }

    // Check win/lose conditions after all changes
    this.checkGameEnd(state);

    // Always create new shooting bubble (unless game ended)
    if (state.gameStatus === 'playing') {
      state.currentBubble = this.createNewBubble();
    }

    // Clear moving bubble
    state.movingBubble = null;
    this.gameState.next(state);
  }

  private calculateTrajectory(
    bubble: Bubble,
    targetX: number,
    targetY: number,
  ): { dx: number; dy: number } {
    const dx = targetX - bubble.x;
    const dy = targetY - bubble.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    return {
      dx: (dx / length) * this.ANIMATION_SPEED,
      dy: (dy / length) * this.ANIMATION_SPEED,
    };
  }

  private checkBubbleCollision(
    x: number,
    y: number,
    grid: Bubble[][],
  ): boolean {
    for (const row of grid) {
      for (const bubble of row) {
        if (bubble) {
          const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
          if (distance <= this.BUBBLE_RADIUS * 2) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private getGridPosition(
    position: Position,
  ): { row: number; col: number } | null {
    const bubbleSize = this.BUBBLE_RADIUS * 2;

    for (let row = 0; row < this.GRID_ROWS; row++) {
      const xOffset = (row % 2) * this.BUBBLE_RADIUS;
      const rowY = this.BUBBLE_RADIUS + row * (bubbleSize * 0.866);

      if (Math.abs(position.y - rowY) <= this.BUBBLE_RADIUS) {
        for (let col = 0; col < this.GRID_COLS; col++) {
          const colX = this.BUBBLE_RADIUS + col * bubbleSize + xOffset;
          if (Math.abs(position.x - colX) <= this.BUBBLE_RADIUS) {
            return { row, col };
          }
        }
      }
    }
    return null;
  }

  private isValidGridPosition(
    position: { row: number; col: number },
    grid: Bubble[][],
  ): boolean {
    const { row, col } = position;
    return (
      row >= 0 &&
      row < this.GRID_ROWS &&
      col >= 0 &&
      col < this.GRID_COLS &&
      (!grid[row] || !grid[row][col])
    );
  }

  private placeBubbleInGrid(
    position: { row: number; col: number },
    color: string,
    state: GameState,
  ): void {
    const { row, col } = position;

    if (!state.bubbles[row]) {
      state.bubbles[row] = [];
    }

    const bubbleSize = this.BUBBLE_RADIUS * 2;
    const xOffset = (row % 2) * this.BUBBLE_RADIUS;
    const x = this.BUBBLE_RADIUS + col * bubbleSize + xOffset;
    const y = this.BUBBLE_RADIUS + row * (bubbleSize * 0.866);

    state.bubbles[row][col] = {
      x,
      y,
      color,
      radius: this.BUBBLE_RADIUS,
    };
  }

  private findMatches(
    position: { row: number; col: number },
    grid: Bubble[][],
  ): { row: number; col: number }[] {
    const visited = new Set<string>();
    const matches: { row: number; col: number }[] = [];
    const targetColor = grid[position.row]?.[position.col]?.color;

    if (!targetColor) return matches;

    const queue = [position];
    visited.add(`${position.row},${position.col}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      matches.push(current);

      // Check adjacent positions (hexagonal grid)
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        if (
          !visited.has(key) &&
          grid[neighbor.row]?.[neighbor.col]?.color === targetColor
        ) {
          visited.add(key);
          queue.push(neighbor);
        }
      }
    }

    return matches;
  }

  private getNeighbors(position: {
    row: number;
    col: number;
  }): { row: number; col: number }[] {
    const { row, col } = position;
    const neighbors = [];
    const isEvenRow = row % 2 === 0;

    // Hexagonal grid neighbors
    const offsets = isEvenRow
      ? [
          [-1, -1],
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
        ]
      : [
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, 0],
          [1, 1],
        ];

    for (const [dr, dc] of offsets) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (
        newRow >= 0 &&
        newRow < this.GRID_ROWS &&
        newCol >= 0 &&
        newCol < this.GRID_COLS
      ) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  }

  private removeBubbles(
    positions: { row: number; col: number }[],
    state: GameState,
  ): void {
    for (const position of positions) {
      if (state.bubbles[position.row]) {
        delete state.bubbles[position.row][position.col];
      }
    }

    // Remove floating bubbles
    this.removeFloatingBubbles(state);
  }

  private removeFloatingBubbles(state: GameState): void {
    const connected = new Set<string>();

    // Mark all bubbles connected to the top
    for (let col = 0; col < this.GRID_COLS; col++) {
      if (state.bubbles[0]?.[col]) {
        this.markConnected(0, col, state.bubbles, connected);
      }
    }

    // Remove bubbles not connected to top
    for (let row = 0; row < this.GRID_ROWS; row++) {
      if (state.bubbles[row]) {
        for (let col = 0; col < this.GRID_COLS; col++) {
          if (state.bubbles[row][col] && !connected.has(`${row},${col}`)) {
            delete state.bubbles[row][col];
            state.score += 5; // Bonus points for floating bubbles
          }
        }
      }
    }
  }

  private markConnected(
    row: number,
    col: number,
    grid: Bubble[][],
    connected: Set<string>,
  ): void {
    const key = `${row},${col}`;
    if (connected.has(key) || !grid[row]?.[col]) {
      return;
    }

    connected.add(key);
    const neighbors = this.getNeighbors({ row, col });
    for (const neighbor of neighbors) {
      this.markConnected(neighbor.row, neighbor.col, grid, connected);
    }
  }

  private addNewRow(state: GameState): void {
    // Check if adding a new row would cause game over
    // If the last row (row 9) has bubbles, adding a row would cause game over
    // More forgiving - only check the very last row
    const gameOverRow = this.GRID_ROWS - 1; // Row 9 (0-indexed)
    let hasBottomRowBubbles = false;

    if (state.bubbles[gameOverRow]) {
      for (let col = 0; col < this.GRID_COLS; col++) {
        if (state.bubbles[gameOverRow][col]) {
          hasBottomRowBubbles = true;
          break;
        }
      }
    }

    // If the very last row has bubbles, adding a new row would cause game over
    if (hasBottomRowBubbles) {
      state.gameStatus = 'lost';
      return;
    }

    // Shift all existing bubbles down one row
    for (let row = this.GRID_ROWS - 1; row > 0; row--) {
      if (state.bubbles[row - 1]) {
        state.bubbles[row] = [...(state.bubbles[row - 1] || [])];
        // Update y positions
        for (let col = 0; col < this.GRID_COLS; col++) {
          if (state.bubbles[row][col]) {
            const bubbleSize = this.BUBBLE_RADIUS * 2;
            state.bubbles[row][col].y =
              this.BUBBLE_RADIUS + row * (bubbleSize * 0.866);
          }
        }
      } else {
        state.bubbles[row] = [];
      }
    }

    // Create new top row - fill completely
    state.bubbles[0] = [];
    const bubbleSize = this.BUBBLE_RADIUS * 2;
    const offsetX = this.BUBBLE_RADIUS;
    const offsetY = this.BUBBLE_RADIUS;

    for (let col = 0; col < this.GRID_COLS; col++) {
      const xOffset = 0; // Top row doesn't need offset
      const x = offsetX + col * bubbleSize + xOffset;
      const y = offsetY;

      if (x + this.BUBBLE_RADIUS <= this.CANVAS_WIDTH) {
        const color = this.getRandomColor();
        state.bubbles[0][col] = {
          x,
          y,
          color,
          radius: this.BUBBLE_RADIUS,
        };
      }
    }
  }

  private checkGameEnd(state: GameState): void {
    // Check if all bubbles are cleared (win condition)
    let hasBubbles = false;
    for (const row of state.bubbles) {
      if (row) {
        for (const bubble of row) {
          if (bubble) {
            hasBubbles = true;
            break;
          }
        }
        if (hasBubbles) break;
      }
    }

    if (!hasBubbles) {
      state.gameStatus = 'won';
      state.score += 1000; // Bonus for winning
      return;
    }

    // Check if bubbles reached the danger zone (lose condition)
    // More forgiving - only check the very last row (row 9)
    const dangerRow = this.GRID_ROWS - 1; // Row 9 (0-indexed)
    if (state.bubbles[dangerRow]) {
      for (let col = 0; col < this.GRID_COLS; col++) {
        if (state.bubbles[dangerRow][col]) {
          state.gameStatus = 'lost';
          return;
        }
      }
    }
  }

  public startNewGame(): void {
    // Stop any ongoing animations
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.initializeGame();
  }

  public getCurrentState(): GameState {
    return this.gameState.value;
  }

  public stopAnimations(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
