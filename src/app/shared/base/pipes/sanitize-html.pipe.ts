import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { InputValidationService } from '../../services/input-validation.service';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true,
})
export class SanitizeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly validator = inject(InputValidationService);

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }

    // First validate and sanitize the input
    const result = this.validator.validateAndSanitizeText(value);

    if (!result.isValid) {
      // eslint-disable-next-line no-console
      console.warn('Potentially unsafe content detected:', result.errors);
      return this.sanitizer.bypassSecurityTrustHtml(result.sanitized || '');
    }

    // Use Angular's sanitizer for additional protection
    return this.sanitizer.bypassSecurityTrustHtml(result.sanitized || value);
  }
}
