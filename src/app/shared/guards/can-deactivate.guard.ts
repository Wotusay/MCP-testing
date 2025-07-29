import { inject } from '@angular/core';
import { type CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggingService } from '../services/logging.service';

/**
 * Interface for components that can be deactivated
 */
export interface CanComponentDeactivate {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}

/**
 * Interface for components with unsaved changes
 */
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
  getUnsavedChangesMessage?(): string;
}

/**
 * Guard to prevent navigation away from forms with unsaved changes
 */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (
  component,
  route,
  state,
  nextState,
) => {
  const logger = inject(LoggingService);

  if (!component.hasUnsavedChanges()) {
    logger.debug('Deactivate guard: No unsaved changes, allowing navigation');
    return true;
  }

  const message =
    component.getUnsavedChangesMessage?.() ||
    'You have unsaved changes. Do you want to leave this page?';

  logger.info('Deactivate guard: Unsaved changes detected', {
    currentRoute: state?.url,
    nextRoute: nextState?.url,
  });

  return confirm(message);
};

/**
 * Generic can deactivate guard
 */
export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  route,
  state,
  nextState,
) => {
  const logger = inject(LoggingService);

  logger.debug('Deactivate guard: Checking if component can be deactivated', {
    currentRoute: state?.url,
    nextRoute: nextState?.url,
  });

  return component.canDeactivate();
};

/**
 * Guard for forms that require confirmation before leaving
 */
export const formGuard: CanDeactivateFn<{
  form?: { dirty: boolean; value: unknown };
}> = (component, route, state, nextState) => {
  const logger = inject(LoggingService);

  // Check if component has a form with changes
  if (component.form && component.form.dirty) {
    logger.info('Form guard: Form has unsaved changes', {
      currentRoute: state?.url,
      nextRoute: nextState?.url,
      formValue: component.form.value,
    });

    return confirm(
      'You have unsaved form changes. Do you want to leave this page?',
    );
  }

  logger.debug('Form guard: No unsaved form changes, allowing navigation');
  return true;
};
