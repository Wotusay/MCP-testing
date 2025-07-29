/**
 * Mock data for testing purposes
 */

export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  active: boolean;
  createdAt: Date;
}

export interface MockProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface MockApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

/**
 * Mock user data
 */
export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    active: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    active: true,
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'moderator',
    active: false,
    createdAt: new Date('2023-03-10'),
  },
];

/**
 * Mock product data
 */
export const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: 'Laptop',
    description: 'High-performance laptop for work and gaming',
    price: 1299.99,
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 2,
    name: 'Smartphone',
    description: 'Latest smartphone with advanced features',
    price: 699.99,
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 3,
    name: 'Desk Chair',
    description: 'Ergonomic office chair for comfortable work',
    price: 299.99,
    category: 'Furniture',
    inStock: false,
  },
];

/**
 * Mock factory functions
 */
export class MockDataFactory {
  /**
   * Create a mock user with optional overrides
   */
  static createUser(overrides: Partial<MockUser> = {}): MockUser {
    return {
      id: Math.floor(Math.random() * 1000),
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      active: true,
      createdAt: new Date(),
      ...overrides,
    };
  }

  /**
   * Create multiple mock users
   */
  static createUsers(
    count: number,
    overrides: Partial<MockUser> = {},
  ): MockUser[] {
    return Array.from({ length: count }, (_, index) =>
      MockDataFactory.createUser({
        id: index + 1,
        name: `Test User ${index + 1}`,
        email: `test${index + 1}@example.com`,
        ...overrides,
      }),
    );
  }

  /**
   * Create a mock product with optional overrides
   */
  static createProduct(overrides: Partial<MockProduct> = {}): MockProduct {
    return {
      id: Math.floor(Math.random() * 1000),
      name: 'Test Product',
      description: 'Test product description',
      price: 99.99,
      category: 'Test Category',
      inStock: true,
      ...overrides,
    };
  }

  /**
   * Create multiple mock products
   */
  static createProducts(
    count: number,
    overrides: Partial<MockProduct> = {},
  ): MockProduct[] {
    return Array.from({ length: count }, (_, index) =>
      MockDataFactory.createProduct({
        id: index + 1,
        name: `Test Product ${index + 1}`,
        ...overrides,
      }),
    );
  }

  /**
   * Create mock API response
   */
  static createApiResponse<T>(
    data: T,
    overrides: Partial<MockApiResponse<T>> = {},
  ): MockApiResponse<T> {
    return {
      data,
      success: true,
      timestamp: new Date(),
      ...overrides,
    };
  }

  /**
   * Create mock error response
   */
  static createErrorResponse<T>(
    message: string = 'An error occurred',
    data: T | null = null,
  ): MockApiResponse<T | null> {
    return {
      data,
      success: false,
      message,
      timestamp: new Date(),
    };
  }
}
