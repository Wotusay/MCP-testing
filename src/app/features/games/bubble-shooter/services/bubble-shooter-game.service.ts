import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Bubble {
  x: number;
  y: number;
  color: string;
  radius: number;
}

export interface GameState {
  bubbles: Bubble[][];
  currentBubble: Bubble | null;
  score: number;
  gameStatus: 'playing' | 'won' | 'lost';
  rows: number;
  cols: number;
  canvasWidth: number;
  canvasHeight: number;
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
  private readonly GRID_ROWS = 10;
  private readonly GRID_COLS = 10;

  private gameState = new BehaviorSubject<GameState>(this.createInitialState());
  public gameState$ = this.gameState.asObservable();

  constructor() {
    this.initializeGame();
  }

  private createInitialState(): GameState {
    return {
      bubbles: [],
      currentBubble: null,
      score: 0,
      gameStatus: 'playing',
      rows: this.GRID_ROWS,
      cols: this.GRID_COLS,
      canvasWidth: this.CANVAS_WIDTH,
      canvasHeight: this.CANVAS_HEIGHT,
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
    return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
  }

  public shootBubble(targetX: number, targetY: number): void {
    const currentState = this.gameState.value;
    if (currentState.gameStatus !== 'playing' || !currentState.currentBubble) {
      return;
    }

    // Calculate trajectory and simulate bubble movement
    const bubble = currentState.currentBubble;
    const trajectory = this.calculateTrajectory(bubble, targetX, targetY);
    const finalPosition = this.simulateBubbleMovement(bubble, trajectory);

    if (finalPosition) {
      // Place bubble in grid
      const gridPosition = this.getGridPosition(finalPosition);
      if (
        gridPosition &&
        this.isValidGridPosition(gridPosition, currentState.bubbles)
      ) {
        this.placeBubbleInGrid(gridPosition, bubble.color, currentState);

        // Check for matches and remove them
        const matchedBubbles = this.findMatches(
          gridPosition,
          currentState.bubbles,
        );
        if (matchedBubbles.length >= 3) {
          this.removeBubbles(matchedBubbles, currentState);
          currentState.score += matchedBubbles.length * 10;
        }

        // Check win/lose conditions
        this.checkGameEnd(currentState);

        // Create new shooting bubble
        currentState.currentBubble = this.createNewBubble();

        this.gameState.next(currentState);
      }
    }
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
      dx: (dx / length) * 5, // Speed factor
      dy: (dy / length) * 5,
    };
  }

  private simulateBubbleMovement(
    bubble: Bubble,
    trajectory: { dx: number; dy: number },
  ): Position | null {
    let x = bubble.x;
    let y = bubble.y;
    const { dx, dy } = trajectory;

    // Simulate movement until collision
    while (y > this.BUBBLE_RADIUS) {
      x += dx;
      y += dy;

      // Wall bouncing
      if (
        x <= this.BUBBLE_RADIUS ||
        x >= this.CANVAS_WIDTH - this.BUBBLE_RADIUS
      ) {
        trajectory.dx *= -1;
      }

      // Check collision with existing bubbles
      const collision = this.checkBubbleCollision(
        x,
        y,
        this.gameState.value.bubbles,
      );
      if (collision) {
        return { x, y };
      }
    }

    return { x, y }; // Reached top
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

    // Check if bubbles reached bottom (lose condition)
    const lastRows = state.bubbles.slice(-3);
    for (const row of lastRows) {
      if (row) {
        for (const bubble of row) {
          if (bubble) {
            state.gameStatus = 'lost';
            return;
          }
        }
      }
    }
  }

  public startNewGame(): void {
    this.initializeGame();
  }

  public getCurrentState(): GameState {
    return this.gameState.value;
  }
}
