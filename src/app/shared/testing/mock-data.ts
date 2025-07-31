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

// Dashboard data interfaces
export interface SummaryCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}

export interface PerformanceData {
  day: string;
  value: number;
  secondaryValue: number;
}

export interface FunnelData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface QuickMetric {
  label: string;
  value: string;
  status?: 'success' | 'warning' | 'danger';
}

export interface ClientEntry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status:
    | 'Interested'
    | 'Follow-up'
    | 'Converted'
    | 'Initial Contact'
    | 'Not Interested';
  lastContact: string;
  method: 'Email' | 'Phone' | 'Meeting' | 'LinkedIn';
  revenue: number;
}

/**
 * Dashboard mock data
 */
export const mockSummaryCards: SummaryCard[] = [
  {
    title: 'Total Clients Reached',
    value: '1,247',
    change: '+12.5% from last month',
    changeType: 'positive',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    title: 'Response Rate',
    value: '34.2%',
    change: '+2.1% from last month',
    changeType: 'positive',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    title: 'Conversion Rate',
    value: '8.7%',
    change: '-0.3% from last month',
    changeType: 'negative',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    title: 'Revenue Generated',
    value: '$24,890',
    change: '+18.2% from last month',
    changeType: 'positive',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export const mockPerformanceData: PerformanceData[] = [
  { day: 'Mon', value: 85, secondaryValue: 42 },
  { day: 'Tue', value: 92, secondaryValue: 58 },
  { day: 'Wed', value: 78, secondaryValue: 35 },
  { day: 'Thu', value: 100, secondaryValue: 67 },
  { day: 'Fri', value: 88, secondaryValue: 51 },
  { day: 'Sat', value: 45, secondaryValue: 18 },
  { day: 'Sun', value: 52, secondaryValue: 22 },
];

export const mockFunnelData: FunnelData[] = [
  { label: 'Initial Contact', value: 600, percentage: 48, color: '#3b82f6' },
  { label: 'Follow-up', value: 413, percentage: 33, color: '#10b981' },
  { label: 'Interested', value: 175, percentage: 14, color: '#f59e0b' },
  { label: 'Converted', value: 63, percentage: 5, color: '#ef4444' },
];

export const mockRecentOutreach: QuickMetric[] = [
  { label: 'Emails Sent', value: '157', status: 'success' },
  { label: 'Cold Calls', value: '89', status: 'warning' },
  { label: 'LinkedIn Messages', value: '34', status: 'success' },
];

export const mockEngagementTypes: QuickMetric[] = [
  { label: 'Email Responses', value: '43' },
  { label: 'Phone Call-backs', value: '18' },
  { label: 'Meeting Requests', value: '12' },
];

export const mockTodaySchedule: QuickMetric[] = [
  { label: 'Scheduled Calls', value: '8', status: 'success' },
  { label: 'Follow-ups Due', value: '15', status: 'warning' },
  { label: 'New Leads', value: '5' },
];

export const mockPerformanceMetrics: QuickMetric[] = [
  { label: 'Avg Response Time', value: '2.4h', status: 'success' },
  { label: 'Meeting Show Rate', value: '78%', status: 'success' },
  { label: 'Deal Close Rate', value: '12%', status: 'warning' },
];

export const mockClientEntries: ClientEntry[] = [
  {
    id: 'SJ',
    name: 'Sarah Johnson',
    company: 'TechCorp Inc.',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    status: 'Interested',
    lastContact: '2 hours ago',
    method: 'Email',
    revenue: 15000,
  },
  {
    id: 'MC',
    name: 'Michael Chen',
    company: 'DataSystems LLC',
    email: 'm.chen@datasystems.com',
    phone: '+1 (555) 987-6543',
    status: 'Follow-up',
    lastContact: '1 day ago',
    method: 'Phone',
    revenue: 8500,
  },
  {
    id: 'ER',
    name: 'Emily Rodriguez',
    company: 'CloudVentures',
    email: 'emily@cloudventures.io',
    phone: '+1 (555) 456-7890',
    status: 'Converted',
    lastContact: '3 days ago',
    method: 'Meeting',
    revenue: 25000,
  },
  {
    id: 'DK',
    name: 'David Kim',
    company: 'StartupHub',
    email: 'd.kim@startuphub.com',
    phone: '+1 (555) 321-0987',
    status: 'Initial Contact',
    lastContact: '5 hours ago',
    method: 'LinkedIn',
    revenue: 0,
  },
  {
    id: 'LT',
    name: 'Lisa Thompson',
    company: 'InnovateLab',
    email: 'lisa@innovatelab.com',
    phone: '+1 (555) 654-3210',
    status: 'Interested',
    lastContact: '6 hours ago',
    method: 'Email',
    revenue: 12000,
  },
  {
    id: 'JW',
    name: 'James Wilson',
    company: 'Future Systems',
    email: 'j.wilson@futuresys.com',
    phone: '+1 (555) 789-0123',
    status: 'Not Interested',
    lastContact: '1 week ago',
    method: 'Phone',
    revenue: 0,
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
