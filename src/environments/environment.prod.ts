export const environment = {
  production: true,
  apiUrl: 'https://api.productiondomain.com/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  security: {
    enableCsrfProtection: true,
    enableSecurityHeaders: true,
    maxRequestsPerMinute: 60,
    sessionTimeout: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 12,
    enableTwoFactor: true,
    allowedDomains: ['productiondomain.com', 'api.productiondomain.com'],
    enableAuditLogging: true,
  },
  features: {
    enableServiceWorker: true,
    enableOfflineMode: true,
  },
};
