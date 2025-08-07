import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameTileComponent } from './game-tile.component';
import { GameState } from '../services/wordle-game.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GameTileComponent],
  template: `
    <div
      class="grid grid-rows-6 gap-2 p-4"
      role="grid"
      aria-label="Wordle game board"
    >
      <div
        *ngFor="let row of gameState.board; let rowIndex = index"
        class="grid grid-cols-5 gap-2"
        role="row"
        [attr.aria-label]="'Row ' + (rowIndex + 1)"
      >
        <app-game-tile
          *ngFor="let tile of row.tiles; let colIndex = index"
          [letter]="tile.letter"
          [state]="tile.state"
          [isCurrentPosition]="isCurrentPosition(rowIndex, colIndex)"
          role="gridcell"
        />
      </div>
    </div>
  `,
})
export class GameBoardComponent {
  @Input() gameState!: GameState;

  isCurrentPosition(rowIndex: number, colIndex: number): boolean {
    return (
      this.gameState.gameStatus === 'playing' &&
      rowIndex === this.gameState.currentRow &&
      colIndex === this.gameState.currentCol
    );
  }
}
