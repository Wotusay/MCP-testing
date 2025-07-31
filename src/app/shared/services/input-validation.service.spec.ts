import { TestBed } from '@angular/core/testing';
import { InputValidationService } from './input-validation.service';

describe('InputValidationService', () => {
  let service: InputValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateAndSanitizeText', () => {
    it('should validate clean text', () => {
      const result = service.validateAndSanitizeText('Hello World');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.sanitized).toBe('Hello World');
    });

    it('should detect and sanitize XSS attempts', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello';
      const result = service.validateAndSanitizeText(maliciousInput);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Potentially malicious script content detected',
      );
      expect(result.sanitized).not.toContain('<script>');
    });

    it('should detect SQL injection attempts', () => {
      const sqlInjection = "'; DROP TABLE users; --";
      const result = service.validateAndSanitizeText(sqlInjection);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Potentially malicious SQL content detected',
      );
    });

    it('should handle iframe injection', () => {
      const iframeInjection = '<iframe src="javascript:alert(1)"></iframe>';
      const result = service.validateAndSanitizeText(iframeInjection);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Potentially malicious script content detected',
      );
    });

    it('should handle empty or null input', () => {
      const result1 = service.validateAndSanitizeText('');
      const result2 = service.validateAndSanitizeText(
        null as unknown as string,
      );

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      const result = service.validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.sanitized).toBe('test@example.com');
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
      ];

      invalidEmails.forEach((email) => {
        const result = service.validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid email format');
      });
    });

    it('should reject overly long emails', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = service.validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email address too long');
    });

    it('should detect suspicious patterns in email', () => {
      const maliciousEmail = 'test@example.com<script>alert(1)</script>';
      const result = service.validateEmail(maliciousEmail);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateUrl', () => {
    it('should validate valid HTTPS URLs', () => {
      const result = service.validateUrl('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate valid HTTP URLs', () => {
      const result = service.validateUrl('http://example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject dangerous protocols', () => {
      const dangerousUrls = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'file:///etc/passwd',
      ];

      dangerousUrls.forEach((url) => {
        const result = service.validateUrl(url);
        expect(result.isValid).toBe(false);
        expect(result.errors.some((error) => error.includes('Protocol'))).toBe(
          true,
        );
      });
    });

    it('should reject localhost URLs', () => {
      const localhostUrls = [
        'http://localhost:3000',
        'https://127.0.0.1',
        'http://example.local',
      ];

      localhostUrls.forEach((url) => {
        const result = service.validateUrl(url);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Local URLs are not allowed');
      });
    });
  });

  describe('validateFileName', () => {
    it('should validate safe file names', () => {
      const result = service.validateFileName('document.pdf');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject path traversal attempts', () => {
      const maliciousNames = [
        '../../../etc/passwd',
        '..\\windows\\system32\\config',
        'folder/file.txt',
        'folder\\file.txt',
      ];

      maliciousNames.forEach((name) => {
        const result = service.validateFileName(name);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'File name contains invalid path characters',
        );
      });
    });

    it('should reject dangerous file extensions', () => {
      const dangerousFiles = [
        'malware.exe',
        'script.bat',
        'trojan.scr',
        'virus.vbs',
      ];

      dangerousFiles.forEach((fileName) => {
        const result = service.validateFileName(fileName);
        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((error) => error.includes('File extension')),
        ).toBe(true);
      });
    });

    it('should reject overly long file names', () => {
      const longName = 'a'.repeat(260) + '.txt';
      const result = service.validateFileName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('File name too long');
    });
  });
});
