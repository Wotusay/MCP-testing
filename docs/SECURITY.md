# Security Implementation Guide

This document outlines the security measures implemented in the Angular Team Project to protect against common web vulnerabilities and ensure data security.

## Security Features Implemented

### 1. Content Security Policy (CSP)

**Location**: `src/index.html`

A comprehensive Content Security Policy has been implemented to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.productiondomain.com http://localhost:3000;
  manifest-src 'self';
  worker-src 'self';
" />
```

**Features**:
- Restricts script execution to trusted sources
- Prevents inline script execution (except for necessary cases)
- Controls resource loading from external domains
- Blocks data exfiltration attempts

### 2. Security Headers

**Location**: `src/index.html`

Additional security headers implemented:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - Enables XSS filtering
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information

### 3. Input Validation and Sanitization

**Location**: `src/app/shared/services/input-validation.service.ts`

Comprehensive input validation service that prevents:

- **XSS Attacks**: Detects and sanitizes malicious scripts
- **SQL Injection**: Identifies suspicious SQL patterns
- **Path Traversal**: Validates file names and paths
- **Email Validation**: Secure email format validation
- **URL Validation**: Prevents malicious URLs and protocols

**Usage**:
```typescript
import { InputValidationService } from './shared/services/input-validation.service';

constructor(private validator: InputValidationService) {}

validateUserInput(input: string) {
  const result = this.validator.validateAndSanitizeText(input);
  if (!result.isValid) {
    console.warn('Invalid input:', result.errors);
    return result.sanitized;
  }
  return input;
}
```

### 4. Rate Limiting

**Location**: `src/app/shared/services/rate-limiting.service.ts`

Implements rate limiting to prevent abuse:

- **Configurable Limits**: Different limits for development and production
- **User-based Limiting**: Tracks requests per authenticated user
- **Endpoint-specific Rules**: Stricter limits for sensitive endpoints
- **Automatic Cleanup**: Removes expired rate limit records

**Configuration** (in environment files):
```typescript
security: {
  maxRequestsPerMinute: 100, // Development: 100, Production: 60
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
}
```

### 5. Security Interceptor

**Location**: `src/app/shared/interceptors/security.interceptor.ts`

Adds security headers to HTTP requests:

- `X-Requested-With: XMLHttpRequest` - CSRF protection
- `Cache-Control: no-cache, no-store, must-revalidate` - Prevents caching of sensitive data
- `Pragma: no-cache` - HTTP/1.0 cache control
- `Expires: 0` - Forces cache expiration

### 6. Authentication and Authorization

**Enhanced Features**:
- Role-based access control (RBAC)
- Permission-based guards
- Secure session management
- Automatic logout on security violations

**Guards Available**:
- `authGuard` - Requires authentication
- `roleGuard` - Requires specific roles
- `permissionGuard` - Requires specific permissions
- `guestGuard` - Redirects authenticated users

### 7. Environment Security

**Location**: `src/environments/`

Separate configurations for development and production:

**Development**:
- Relaxed security settings for testing
- Local domain allowlist
- Extended session timeout

**Production**:
- Strict security settings
- Two-factor authentication enabled
- Shorter session timeout
- Limited allowed domains

### 8. Dependency Security

**npm Scripts**:
```bash
npm run security:audit       # Run security audit
npm run security:audit-fix   # Fix security vulnerabilities
npm run security:check       # Complete security check
npm run security:scan        # Run security scan
```

## Security Best Practices

### For Developers

1. **Always Validate Input**:
   ```typescript
   const result = this.inputValidator.validateAndSanitizeText(userInput);
   if (!result.isValid) {
     // Handle invalid input
   }
   ```

2. **Use Security Pipes**:
   ```html
   <div [innerHTML]="userContent | sanitizeHtml"></div>
   ```

3. **Check Rate Limits**:
   ```typescript
   this.rateLimitService.checkRateLimit(userId).subscribe(() => {
     // Proceed with request
   });
   ```

4. **Implement Proper Error Handling**:
   - Never expose sensitive information in error messages
   - Log security violations for monitoring
   - Use generic error messages for users

### For Deployment

1. **Enable HTTPS**: Always use HTTPS in production
2. **Update Dependencies**: Regularly run `npm audit` and fix vulnerabilities
3. **Monitor Logs**: Set up monitoring for security events
4. **Environment Variables**: Use secure environment variable management

## Testing Security Features

Security tests are located in:
- `src/app/shared/services/input-validation.service.spec.ts`
- `src/app/shared/services/rate-limiting.service.spec.ts`

Run security tests:
```bash
npm test
```

## Security Monitoring

The application logs security-relevant events:

- Authentication attempts
- Rate limit violations
- Input validation failures
- Suspicious request patterns

Monitor these logs in production for security incidents.

## Incident Response

1. **Immediate Actions**:
   - Block suspicious IP addresses
   - Invalidate compromised sessions
   - Review audit logs

2. **Investigation**:
   - Analyze security logs
   - Check for data breaches
   - Document the incident

3. **Recovery**:
   - Patch vulnerabilities
   - Update security configurations
   - Notify affected users if necessary

## Security Checklist

- [x] Content Security Policy implemented
- [x] Security headers configured
- [x] Input validation and sanitization
- [x] Rate limiting implemented
- [x] Authentication and authorization enhanced
- [x] Environment security configured
- [x] Dependency vulnerability scanning
- [x] Security tests implemented
- [x] Documentation provided

## Future Enhancements

- Implement CSRF tokens
- Add request signing
- Implement audit logging
- Add intrusion detection
- Set up security monitoring dashboards