export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  security: {
    enableCsrfProtection: true,
    enableSecurityHeaders: true,
    maxRequestsPerMinute: 100,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    passwordMinLength: 8,
    enableTwoFactor: false,
    allowedDomains: ['localhost:4200', 'localhost:3000'],
    enableAuditLogging: true,
  },
  features: {
    enableServiceWorker: false,
    enableOfflineMode: false,
  },
};
