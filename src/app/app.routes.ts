import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
  },
  {
    path: 'games',
    loadComponent: () =>
      import('./features/games/games.component').then((m) => m.GamesComponent),
  },
  {
    path: 'games/wordle',
    loadComponent: () =>
      import('./features/games/wordle/wordle.component').then(
        (m) => m.WordleComponent,
      ),
  },
  {
    path: 'games/bubble-shooter',
    loadComponent: () =>
      import('./features/games/bubble-shooter/bubble-shooter.component').then(
        (m) => m.BubbleShooterComponent,
      ),
  },
  // Legacy route redirect for existing Wordle bookmarks
  {
    path: 'wordle',
    redirectTo: '/games/wordle',
    pathMatch: 'full',
  },
  {
    path: 'material-demo',
    loadComponent: () =>
      import('./features/material-demo/material-demo.component').then(
        (m) => m.MaterialDemoComponent,
      ),
  },
  {
    path: 'design-system',
    loadComponent: () =>
      import('./features/design-system/design-system.component').then(
        (m) => m.DesignSystemComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
