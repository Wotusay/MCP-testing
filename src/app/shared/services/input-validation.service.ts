import { Injectable } from '@angular/core';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InputValidationService {
  private readonly xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*>/gi,
    /<meta\b[^<]*>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<.*?\s+(on\w+|href|src)\s*=\s*['"]*\s*javascript:/gi,
  ];

  private readonly sqlInjectionPatterns = [
    /(\b(select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /(union\s+select)/gi,
    /('|(')|(;|\\x3b)|(\||\\x7c)|(\*|\\x2a))/gi,
    /((%27)|('‧))/gi,
    /((%3D)|(=))[^\n]*((%27)|(')|(\\x27))/gi,
    /(\w*((%27)|('))\s*((%6F)|o|(%4F))((%72)|r|(%52)))/gi,
  ];

  /**
   * Validates and sanitizes user input to prevent XSS attacks
   */
  validateAndSanitizeText(input: string): ValidationResult {
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        errors: ['Input must be a valid string'],
      };
    }

    const errors: string[] = [];
    let sanitized = input;

    // Check for XSS patterns
    for (const pattern of this.xssPatterns) {
      if (pattern.test(input)) {
        errors.push('Potentially malicious script content detected');
        sanitized = sanitized.replace(pattern, '');
      }
    }

    // Check for SQL injection patterns
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.test(input)) {
        errors.push('Potentially malicious SQL content detected');
        break;
      }
    }

    // Additional sanitization
    sanitized = this.htmlEncode(sanitized);

    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Validates email format with security considerations
   */
  validateEmail(email: string): ValidationResult {
    if (!email || typeof email !== 'string') {
      return {
        isValid: false,
        errors: ['Email must be a valid string'],
      };
    }

    const errors: string[] = [];

    // Basic format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    // Length validation
    if (email.length > 254) {
      errors.push('Email address too long');
    }

    // Check for suspicious patterns
    if (this.containsSuspiciousPatterns(email)) {
      errors.push('Email contains potentially malicious content');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: email.toLowerCase().trim(),
    };
  }

  /**
   * Validates URL with security considerations
   */
  validateUrl(url: string): ValidationResult {
    if (!url || typeof url !== 'string') {
      return {
        isValid: false,
        errors: ['URL must be a valid string'],
      };
    }

    const errors: string[] = [];

    try {
      const urlObj = new URL(url);

      // Check for allowed protocols
      const allowedProtocols = ['http:', 'https:', 'mailto:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        errors.push(`Protocol ${urlObj.protocol} is not allowed`);
      }

      // Check for suspicious patterns
      if (this.containsSuspiciousPatterns(url)) {
        errors.push('URL contains potentially malicious content');
      }

      // Check for localhost in production
      if (
        urlObj.hostname === 'localhost' ||
        urlObj.hostname === '127.0.0.1' ||
        urlObj.hostname.endsWith('.local')
      ) {
        errors.push('Local URLs are not allowed');
      }
    } catch {
      errors.push('Invalid URL format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: url.trim(),
    };
  }

  /**
   * Validates file name to prevent path traversal
   */
  validateFileName(fileName: string): ValidationResult {
    if (!fileName || typeof fileName !== 'string') {
      return {
        isValid: false,
        errors: ['File name must be a valid string'],
      };
    }

    const errors: string[] = [];

    // Check for path traversal attempts
    if (
      fileName.includes('..') ||
      fileName.includes('/') ||
      fileName.includes('\\')
    ) {
      errors.push('File name contains invalid path characters');
    }

    // Check for dangerous file extensions
    const dangerousExtensions = [
      '.exe',
      '.bat',
      '.cmd',
      '.com',
      '.pif',
      '.scr',
      '.vbs',
      '.js',
      '.jar',
      '.zip',
      '.rar',
      '.7z',
      '.tar',
      '.gz',
    ];

    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf('.'));
    if (dangerousExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`);
    }

    // Length validation
    if (fileName.length > 255) {
      errors.push('File name too long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: fileName.trim(),
    };
  }

  /**
   * HTML encodes special characters to prevent XSS
   */
  private htmlEncode(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Checks for suspicious patterns that might indicate malicious content
   */
  private containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
      /javascript:/gi,
      /vbscript:/gi,
      /data:/gi,
      /<script/gi,
      /<iframe/gi,
      /eval\(/gi,
      /expression\(/gi,
      /alert\(/gi,
      /confirm\(/gi,
      /prompt\(/gi,
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(input));
  }
}
