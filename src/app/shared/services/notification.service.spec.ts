import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        NotificationService,
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success notification', () => {
    const message = 'Success message';
    service.success(message);

    expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  });

  it('should show error notification', () => {
    const message = 'Error message';
    service.error(message);

    expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  });

  it('should show info notification', () => {
    const message = 'Info message';
    service.info(message);

    expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  });

  it('should show warning notification', () => {
    const message = 'Warning message';
    service.warning(message);

    expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  });

  it('should use custom duration for success notification', () => {
    const message = 'Success message';
    const customDuration = 1000;
    service.success(message, customDuration);

    expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Close', {
      duration: customDuration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  });
});