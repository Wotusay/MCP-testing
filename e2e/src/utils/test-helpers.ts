/**
 * E2E Test helper utilities
 */
export class E2ETestHelpers {
  /**
   * Wait for a specified amount of time
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Generate random test data
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    return `test${this.generateRandomString(6)}@example.com`;
  }

  /**
   * Get current timestamp for unique test data
   */
  static getCurrentTimestamp(): string {
    return new Date().getTime().toString();
  }

  /**
   * Create unique test identifier
   */
  static createTestId(): string {
    return `test-${this.getCurrentTimestamp()}-${this.generateRandomString(4)}`;
  }
}

/**
 * Test data generators for E2E tests
 */
export class E2ETestData {
  static createUserData() {
    return {
      name: `Test User ${E2ETestHelpers.generateRandomString(6)}`,
      email: E2ETestHelpers.generateRandomEmail(),
      active: true
    };
  }

  static createProductData() {
    return {
      name: `Test Product ${E2ETestHelpers.generateRandomString(6)}`,
      description: 'Test product description',
      price: Math.floor(Math.random() * 1000) + 1,
      category: 'Test Category'
    };
  }
}