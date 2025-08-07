import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface GameCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

@Component({
  selector: 'app-games',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200"
    >
      <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Header -->
        <header class="text-center mb-12">
          <h1
            class="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4"
          >
            🎮 Games Collection
          </h1>
          <p
            class="text-body-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto"
          >
            Challenge yourself with our collection of fun and engaging games.
            Each game is built with modern web technologies and supports both
            light and dark themes.
          </p>
        </header>

        <!-- Games Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div
            *ngFor="let game of games"
            class="bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div class="p-6">
              <!-- Game Icon and Title -->
              <div class="flex items-center mb-4">
                <span class="text-3xl mr-3">{{ game.icon }}</span>
                <div>
                  <h3
                    class="text-xl font-semibold text-secondary-900 dark:text-secondary-100"
                  >
                    {{ game.title }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      [ngClass]="{
                        'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200':
                          game.difficulty === 'Easy',
                        'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200':
                          game.difficulty === 'Medium',
                        'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-200':
                          game.difficulty === 'Hard',
                      }"
                    >
                      {{ game.difficulty }}
                    </span>
                    <span
                      class="px-2 py-1 text-xs rounded-full bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200"
                    >
                      {{ game.category }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Game Description -->
              <p
                class="text-secondary-600 dark:text-secondary-400 text-sm mb-6"
              >
                {{ game.description }}
              </p>

              <!-- Play Button -->
              <a
                [routerLink]="game.route"
                class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                  />
                </svg>
                Play Game
              </a>
            </div>
          </div>
        </div>

        <!-- Coming Soon Section -->
        <div
          class="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-8 text-center"
        >
          <h2
            class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4"
          >
            🚀 More Games Coming Soon!
          </h2>
          <p
            class="text-primary-700 dark:text-primary-300 mb-6 max-w-2xl mx-auto"
          >
            We're continuously adding new games to our collection. Stay tuned
            for puzzle games, arcade classics, and brain teasers that will keep
            you entertained for hours.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <span
              class="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full text-sm"
            >
              🧩 Puzzle Games
            </span>
            <span
              class="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full text-sm"
            >
              🎯 Arcade Games
            </span>
            <span
              class="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full text-sm"
            >
              🧠 Brain Teasers
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GamesComponent {
  protected readonly games: GameCard[] = [
    {
      title: 'Wordle',
      description:
        'Guess the 5-letter word in 6 tries. A classic word puzzle game that challenges your vocabulary and deduction skills.',
      route: '/games/wordle',
      icon: '🔤',
      difficulty: 'Medium',
      category: 'Word',
    },
    {
      title: 'Bubble Shooter',
      description:
        'Match 3 or more bubbles of the same color to pop them. Aim carefully and clear all bubbles to win!',
      route: '/games/bubble-shooter',
      icon: '🫧',
      difficulty: 'Easy',
      category: 'Arcade',
    },
  ];
}
