/**
 * Angular Material Module
 * Centralized imports of Material Design components
 * This module exports all Material components used across the application
 */
import { NgModule } from '@angular/core';

// Common Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// Form controls
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Layout
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

// Navigation
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';

// Data display
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// Feedback
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

const MATERIAL_MODULES = [
  // Common
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatMenuModule,
  MatBadgeModule,
  MatChipsModule,
  MatTooltipModule,

  // Forms
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSlideToggleModule,

  // Layout
  MatSidenavModule,
  MatListModule,
  MatGridListModule,
  MatDividerModule,

  // Navigation
  MatTabsModule,
  MatStepperModule,

  // Data
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,

  // Feedback
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDialogModule,
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {}
