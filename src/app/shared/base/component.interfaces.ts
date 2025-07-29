/**
 * Common interfaces and types for component templates
 */

/**
 * Base component properties that all components should support
 */
export interface BaseComponentProps {
  loading?: boolean;
  disabled?: boolean;
  cssClass?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/**
 * Common color variants used across components
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/**
 * Common size variants used across components
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Common status types for components
 */
export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending';

/**
 * Interface for components that display status
 */
export interface StatusComponent extends BaseComponentProps {
  status: StatusType;
  text: string;
}

/**
 * Interface for clickable components
 */
export interface ClickableComponent extends BaseComponentProps {
  onClick?: () => void;
  buttonClick?: () => void;
}

/**
 * Interface for components with variants
 */
export interface VariantComponent extends BaseComponentProps {
  variant?: ColorVariant;
  size?: SizeVariant;
}

/**
 * Interface for form input components
 */
export interface FormInputComponent extends BaseComponentProps {
  value?: unknown;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

/**
 * Interface for card-like components
 */
export interface CardComponent extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: string;
}

/**
 * Interface for icon components
 */
export interface IconComponent extends BaseComponentProps {
  iconPath: string;
  iconColor?: ColorVariant;
  iconSize?: SizeVariant;
  iconLabel?: string;
}

/**
 * Interface for modal/dialog components
 */
export interface ModalComponent extends BaseComponentProps {
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Interface for list components
 */
export interface ListComponent<T = unknown> extends BaseComponentProps {
  items: T[];
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
}

/**
 * Interface for navigation components
 */
export interface NavigationComponent extends BaseComponentProps {
  routes: NavigationItem[];
  activeRoute?: string;
}

/**
 * Navigation item structure
 */
export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  disabled?: boolean;
  children?: NavigationItem[];
}

/**
 * Interface for data table components
 */
export interface TableComponent<T = unknown> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  onRowClick?: (row: T) => void;
}

/**
 * Table column configuration
 */
export interface TableColumn<T = unknown> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => string;
}

/**
 * Generic event handler type
 */
export type EventHandler<T = void> = (event?: T) => void;

/**
 * Component theme configuration
 */
export interface ComponentTheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  text: string;
  border: string;
}
