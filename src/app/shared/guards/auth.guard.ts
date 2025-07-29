import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import { LoggingService } from '../services/logging.service';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const logger = inject(LoggingService);

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    logger.debug('Auth guard: Access granted', {
      route: state.url,
      user: authService.user()?.id,
    });
    return true;
  }

  logger.info('Auth guard: Access denied, redirecting to login', {
    attemptedRoute: state.url,
  });

  // Store the attempted URL for redirect after login
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('redirectUrl', state.url);
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/**
 * Guard to protect routes that require specific roles
 */
export const roleGuard = (requiredRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const logger = inject(LoggingService);

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      logger.info('Role guard: Not authenticated, redirecting to login', {
        attemptedRoute: state.url,
        requiredRoles,
      });
      return router.createUrlTree(['/login']);
    }

    const hasRequiredRole = authService.hasAnyRole(requiredRoles);

    if (hasRequiredRole) {
      logger.debug('Role guard: Access granted', {
        route: state.url,
        user: authService.user()?.id,
        userRoles: authService.user()?.roles,
        requiredRoles,
      });
      return true;
    }

    logger.warn('Role guard: Insufficient permissions', {
      route: state.url,
      user: authService.user()?.id,
      userRoles: authService.user()?.roles,
      requiredRoles,
    });

    return router.createUrlTree(['/unauthorized']);
  };
};

/**
 * Guard to protect routes that require specific permissions
 */
export const permissionGuard = (
  requiredPermissions: string[],
): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);
    const logger = inject(LoggingService);

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
      logger.info('Permission guard: Not authenticated, redirecting to login', {
        attemptedRoute: state.url,
        requiredPermissions,
      });
      return router.createUrlTree(['/login']);
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      authService.hasPermission(permission),
    );

    if (hasAllPermissions) {
      logger.debug('Permission guard: Access granted', {
        route: state.url,
        user: authService.user()?.id,
        userPermissions: authService.user()?.permissions,
        requiredPermissions,
      });
      return true;
    }

    logger.warn('Permission guard: Insufficient permissions', {
      route: state.url,
      user: authService.user()?.id,
      userPermissions: authService.user()?.permissions,
      requiredPermissions,
    });

    return router.createUrlTree(['/unauthorized']);
  };
};

/**
 * Guard to redirect authenticated users away from login/register pages
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const logger = inject(LoggingService);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    logger.debug('Guest guard: Access granted (not authenticated)', {
      route: state.url,
    });
    return true;
  }

  logger.info('Guest guard: Already authenticated, redirecting to home', {
    route: state.url,
    user: authService.user()?.id,
  });

  // Check if there's a stored redirect URL
  let redirectUrl = '/home';
  if (typeof window !== 'undefined') {
    const storedUrl = sessionStorage.getItem('redirectUrl');
    if (storedUrl) {
      redirectUrl = storedUrl;
      sessionStorage.removeItem('redirectUrl');
    }
  }

  return router.createUrlTree([redirectUrl]);
};
