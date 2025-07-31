import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { McpService } from './mcp.service';
import { LoggingService } from './logging.service';
import {
  SummaryCard,
  PerformanceData,
  FunnelData,
  QuickMetric,
  ClientEntry,
} from '../testing/mock-data';

/**
 * Database entities corresponding to Supabase tables
 */
export interface DbClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  last_contact: string;
  contact_method: string;
  revenue: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbMetric {
  id: string;
  metric_type: string;
  name: string;
  value: string;
  change_value?: string;
  change_type?: 'positive' | 'negative';
  icon?: string;
  status?: 'success' | 'warning' | 'danger';
  created_at?: string;
}

export interface DbPerformanceData {
  id: string;
  day: string;
  outreach_attempts: number;
  responses: number;
  date: string;
}

export interface DbFunnelStage {
  id: string;
  stage_name: string;
  client_count: number;
  percentage: number;
  color: string;
  stage_order: number;
}

/**
 * Dashboard Data Service
 * Handles all data operations for the dashboard using MCP/Supabase
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  private readonly mcp = inject(McpService);
  private readonly logger = inject(LoggingService);

  /**
   * Get summary cards data
   */
  getSummaryCards(): Observable<SummaryCard[]> {
    this.logger.debug('Fetching summary cards data');

    return this.mcp
      .query<DbMetric>('dashboard_metrics', '*', { metric_type: 'summary' })
      .pipe(
        map((metrics) =>
          metrics.map((metric) => ({
            title: metric.name,
            value: metric.value,
            change: metric.change_value || '',
            changeType: metric.change_type || 'positive',
            icon: metric.icon || '',
          })),
        ),
        catchError((error) => {
          this.logger.error('Failed to fetch summary cards', { error });
          // Return empty array as fallback
          return of([]);
        }),
      );
  }

  /**
   * Get performance chart data
   */
  getPerformanceData(): Observable<PerformanceData[]> {
    this.logger.debug('Fetching performance data');

    return this.mcp.query<DbPerformanceData>('weekly_performance').pipe(
      map((data) =>
        data.map((item) => ({
          day: item.day,
          value: item.outreach_attempts,
          secondaryValue: item.responses,
        })),
      ),
      catchError((error) => {
        this.logger.error('Failed to fetch performance data', { error });
        return of([]);
      }),
    );
  }

  /**
   * Get funnel chart data
   */
  getFunnelData(): Observable<FunnelData[]> {
    this.logger.debug('Fetching funnel data');

    return this.mcp
      .query<DbFunnelStage>('client_funnel_stages', '*', undefined)
      .pipe(
        map((stages) =>
          stages
            .sort((a, b) => a.stage_order - b.stage_order)
            .map((stage) => ({
              label: stage.stage_name,
              value: stage.client_count,
              percentage: stage.percentage,
              color: stage.color,
            })),
        ),
        catchError((error) => {
          this.logger.error('Failed to fetch funnel data', { error });
          return of([]);
        }),
      );
  }

  /**
   * Get recent outreach metrics
   */
  getRecentOutreach(): Observable<QuickMetric[]> {
    this.logger.debug('Fetching recent outreach metrics');

    return this.mcp
      .query<DbMetric>('dashboard_metrics', '*', {
        metric_type: 'recent_outreach',
      })
      .pipe(
        map((metrics) =>
          metrics.map((metric) => ({
            label: metric.name,
            value: metric.value,
            status: metric.status,
          })),
        ),
        catchError((error) => {
          this.logger.error('Failed to fetch recent outreach', { error });
          return of([]);
        }),
      );
  }

  /**
   * Get engagement types metrics
   */
  getEngagementTypes(): Observable<QuickMetric[]> {
    this.logger.debug('Fetching engagement types');

    return this.mcp
      .query<DbMetric>('dashboard_metrics', '*', {
        metric_type: 'engagement_types',
      })
      .pipe(
        map((metrics) =>
          metrics.map((metric) => ({
            label: metric.name,
            value: metric.value,
            status: metric.status,
          })),
        ),
        catchError((error) => {
          this.logger.error('Failed to fetch engagement types', { error });
          return of([]);
        }),
      );
  }

  /**
   * Get today's schedule metrics
   */
  getTodaySchedule(): Observable<QuickMetric[]> {
    this.logger.debug('Fetching today schedule');

    return this.mcp
      .query<DbMetric>('dashboard_metrics', '*', {
        metric_type: 'today_schedule',
      })
      .pipe(
        map((metrics) =>
          metrics.map((metric) => ({
            label: metric.name,
            value: metric.value,
            status: metric.status,
          })),
        ),
        catchError((error) => {
          this.logger.error('Failed to fetch today schedule', { error });
          return of([]);
        }),
      );
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Observable<QuickMetric[]> {
    this.logger.debug('Fetching performance metrics');

    return this.mcp
      .query<DbMetric>('dashboard_metrics', '*', {
        metric_type: 'performance_metrics',
      })
      .pipe(
        map((metrics) =>
          metrics.map((metric) => ({
            label: metric.name,
            value: metric.value,
            status: metric.status,
          })),
        ),
        catchError((error) => {
          this.logger.error('Failed to fetch performance metrics', { error });
          return of([]);
        }),
      );
  }

  /**
   * Get client entries
   */
  getClientEntries(): Observable<ClientEntry[]> {
    this.logger.debug('Fetching client entries');

    return this.mcp.query<DbClient>('clients').pipe(
      map((clients) =>
        clients.map((client) => ({
          id: client.id,
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          status: client.status as ClientEntry['status'],
          lastContact: client.last_contact,
          method: client.contact_method as ClientEntry['method'],
          revenue: client.revenue,
        })),
      ),
      catchError((error) => {
        this.logger.error('Failed to fetch client entries', { error });
        return of([]);
      }),
    );
  }

  /**
   * Get all dashboard data in a single call
   */
  getDashboardData(): Observable<{
    summaryCards: SummaryCard[];
    performanceData: PerformanceData[];
    funnelData: FunnelData[];
    recentOutreach: QuickMetric[];
    engagementTypes: QuickMetric[];
    todaySchedule: QuickMetric[];
    performanceMetrics: QuickMetric[];
    clientEntries: ClientEntry[];
  }> {
    this.logger.debug('Fetching all dashboard data');

    return combineLatest({
      summaryCards: this.getSummaryCards(),
      performanceData: this.getPerformanceData(),
      funnelData: this.getFunnelData(),
      recentOutreach: this.getRecentOutreach(),
      engagementTypes: this.getEngagementTypes(),
      todaySchedule: this.getTodaySchedule(),
      performanceMetrics: this.getPerformanceMetrics(),
      clientEntries: this.getClientEntries(),
    }).pipe(
      catchError((error) => {
        this.logger.error('Failed to fetch dashboard data', { error });
        // Return empty data structure as fallback
        return of({
          summaryCards: [],
          performanceData: [],
          funnelData: [],
          recentOutreach: [],
          engagementTypes: [],
          todaySchedule: [],
          performanceMetrics: [],
          clientEntries: [],
        });
      }),
    );
  }

  /**
   * Add a new client
   */
  addClient(
    client: Omit<ClientEntry, 'id' | 'lastContact'>,
  ): Observable<ClientEntry> {
    this.logger.debug('Adding new client', { client });

    const dbClient: Partial<DbClient> = {
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      status: client.status,
      contact_method: client.method,
      revenue: client.revenue,
      last_contact: new Date().toISOString(),
    };

    return this.mcp.insert<DbClient>('clients', [dbClient]).pipe(
      map((inserted) => {
        const newClient = inserted[0];
        return {
          id: newClient.id,
          name: newClient.name,
          company: newClient.company,
          email: newClient.email,
          phone: newClient.phone,
          status: newClient.status as ClientEntry['status'],
          lastContact: newClient.last_contact,
          method: newClient.contact_method as ClientEntry['method'],
          revenue: newClient.revenue,
        };
      }),
    );
  }

  /**
   * Update a client
   */
  updateClient(
    id: string,
    updates: Partial<ClientEntry>,
  ): Observable<ClientEntry> {
    this.logger.debug('Updating client', { id, updates });

    const dbUpdates: Partial<DbClient> = {
      ...(updates.name && { name: updates.name }),
      ...(updates.company && { company: updates.company }),
      ...(updates.email && { email: updates.email }),
      ...(updates.phone && { phone: updates.phone }),
      ...(updates.status && { status: updates.status }),
      ...(updates.method && { contact_method: updates.method }),
      ...(updates.revenue !== undefined && { revenue: updates.revenue }),
      updated_at: new Date().toISOString(),
    };

    return this.mcp.update<DbClient>('clients', dbUpdates, { id }).pipe(
      map((updated) => {
        const client = updated[0];
        return {
          id: client.id,
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          status: client.status as ClientEntry['status'],
          lastContact: client.last_contact,
          method: client.contact_method as ClientEntry['method'],
          revenue: client.revenue,
        };
      }),
    );
  }
}
