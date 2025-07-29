import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LoggingService } from '../services/logging.service';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggingService);

  return authService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      logger.warn('Access denied - user not authenticated', {}, 'AUTH_GUARD');
      router.navigate(['/login']);
      return false;
    }),
  );
};

/**
 * Guard to protect routes that require specific roles
 */
export const roleGuard = (requiredRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const logger = inject(LoggingService);

    return authService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          logger.warn(
            'Access denied - user not authenticated',
            {},
            'ROLE_GUARD',
          );
          router.navigate(['/login']);
          return false;
        }

        const hasRequiredRole = authService.hasAnyRole(requiredRoles);
        if (!hasRequiredRole) {
          logger.warn(
            'Access denied - insufficient permissions',
            { requiredRoles, userRoles: authService.getCurrentUser()?.roles },
            'ROLE_GUARD',
          );
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      }),
    );
  };
};

/**
 * Guard to prevent authenticated users from accessing login/register pages
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggingService);

  return authService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        logger.info(
          'Authenticated user redirected from guest page',
          {},
          'GUEST_GUARD',
        );
        router.navigate(['/home']);
        return false;
      }

      return true;
    }),
  );
};
