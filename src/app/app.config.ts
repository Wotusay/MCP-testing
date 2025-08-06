import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import {
  AuthInterceptor,
  CacheInterceptor,
  ErrorInterceptor,
} from './shared/interceptors';
import { dashboardReducer } from './store/dashboard/reducers/dashboard.reducer';
import { DashboardEffects } from './store/dashboard/effects/dashboard.effects';
import { authReducer } from './store/auth/reducers/auth.reducer';
import { AuthEffects } from './store/auth/effects/auth.effects';
import { userReducer } from './store/user/reducers/user.reducer';
import { UserEffects } from './store/user/effects/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    // NgRx Store Configuration
    provideStore({
      dashboard: dashboardReducer,
      auth: authReducer,
      user: userReducer,
    }),
    provideEffects([DashboardEffects, AuthEffects, UserEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
