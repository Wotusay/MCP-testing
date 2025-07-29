/**
 * Base Component Templates Export
 *
 * This module exports all the base templates and utilities
 * for creating new components in the application.
 */

// Base classes and interfaces
export { BaseComponent } from './base.component';
export * from './component.interfaces';

// Re-export for convenience
export type {
  BaseComponentProps,
  ColorVariant,
  SizeVariant,
  StatusType,
  StatusComponent,
  ClickableComponent,
  VariantComponent,
  FormInputComponent,
  CardComponent,
  IconComponent,
  ModalComponent,
  ListComponent,
  NavigationComponent,
  NavigationItem,
  TableComponent,
  TableColumn,
  EventHandler,
  ComponentTheme,
} from './component.interfaces';
