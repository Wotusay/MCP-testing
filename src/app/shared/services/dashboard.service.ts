import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, map, catchError, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Client,
  SummaryMetric,
  PerformanceData,
  FunnelData,
  QuickMetric,
  SummaryCard,
  PerformanceChartData,
  FunnelChartData,
  QuickOverviewMetric,
  ClientEntry,
  DashboardDataTransformer
} from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = this.createSupabaseClient();
  }

  private createSupabaseClient(): SupabaseClient {
    return createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  /**
   * Get all summary cards data
   */
  getSummaryCards(): Observable<SummaryCard[]> {
    return from(
      this.supabase
        .from('summary_metrics')
        .select('*')
        .order('metric_type')
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to fetch summary metrics: ${response.error.message}`);
        }
        return (response.data as SummaryMetric[]).map(
          metric => DashboardDataTransformer.summaryMetricToCard(metric)
        );
      }),
      catchError(error => {
        console.error('Error fetching summary cards:', error);
        throw error;
      })
    );
  }

  /**
   * Get performance chart data
   */
  getPerformanceData(): Observable<PerformanceChartData[]> {
    return from(
      this.supabase
        .from('performance_data')
        .select('*')
        .order('week_start_date', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to fetch performance data: ${response.error.message}`);
        }
        return DashboardDataTransformer.performanceDataToChart(response.data as PerformanceData[]);
      }),
      catchError(error => {
        console.error('Error fetching performance data:', error);
        throw error;
      })
    );
  }

  /**
   * Get funnel chart data
   */
  getFunnelData(): Observable<FunnelChartData[]> {
    return from(
      this.supabase
        .from('funnel_data')
        .select('*')
        .order('stage_order', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to fetch funnel data: ${response.error.message}`);
        }
        return DashboardDataTransformer.funnelDataToChart(response.data as FunnelData[]);
      }),
      catchError(error => {
        console.error('Error fetching funnel data:', error);
        throw error;
      })
    );
  }

  /**
   * Get quick metrics by category
   */
  getQuickMetricsByCategory(category: string): Observable<QuickOverviewMetric[]> {
    return from(
      this.supabase
        .from('quick_metrics')
        .select('*')
        .eq('category', category)
        .order('label')
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to fetch quick metrics for ${category}: ${response.error.message}`);
        }
        return DashboardDataTransformer.quickMetricsToOverview(response.data as QuickMetric[]);
      }),
      catchError(error => {
        console.error(`Error fetching quick metrics for ${category}:`, error);
        throw error;
      })
    );
  }

  /**
   * Get all quick overview data
   */
  getQuickOverviewData(): Observable<{
    recentOutreach: QuickOverviewMetric[];
    engagementTypes: QuickOverviewMetric[];
    todaySchedule: QuickOverviewMetric[];
    performanceMetrics: QuickOverviewMetric[];
  }> {
    return forkJoin({
      recentOutreach: this.getQuickMetricsByCategory('recent_outreach'),
      engagementTypes: this.getQuickMetricsByCategory('engagement_types'),
      todaySchedule: this.getQuickMetricsByCategory('today_schedule'),
      performanceMetrics: this.getQuickMetricsByCategory('performance_metrics')
    });
  }

  /**
   * Get all clients data
   */
  getClients(): Observable<ClientEntry[]> {
    return from(
      this.supabase
        .from('clients')
        .select('*')
        .order('last_contact', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to fetch clients: ${response.error.message}`);
        }
        return (response.data as Client[]).map(
          client => DashboardDataTransformer.clientToEntry(client)
        );
      }),
      catchError(error => {
        console.error('Error fetching clients:', error);
        throw error;
      })
    );
  }

  /**
   * Get all dashboard data in one call
   */
  getAllDashboardData(): Observable<{
    summaryCards: SummaryCard[];
    performanceData: PerformanceChartData[];
    funnelData: FunnelChartData[];
    recentOutreach: QuickOverviewMetric[];
    engagementTypes: QuickOverviewMetric[];
    todaySchedule: QuickOverviewMetric[];
    performanceMetrics: QuickOverviewMetric[];
    clients: ClientEntry[];
  }> {
    return forkJoin({
      summaryCards: this.getSummaryCards(),
      performanceData: this.getPerformanceData(),
      funnelData: this.getFunnelData(),
      quickOverview: this.getQuickOverviewData(),
      clients: this.getClients()
    }).pipe(
      map(result => ({
        summaryCards: result.summaryCards,
        performanceData: result.performanceData,
        funnelData: result.funnelData,
        recentOutreach: result.quickOverview.recentOutreach,
        engagementTypes: result.quickOverview.engagementTypes,
        todaySchedule: result.quickOverview.todaySchedule,
        performanceMetrics: result.quickOverview.performanceMetrics,
        clients: result.clients
      }))
    );
  }

  /**
   * Add a new client
   */
  addClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Observable<Client> {
    return from(
      this.supabase
        .from('clients')
        .insert(client)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to add client: ${response.error.message}`);
        }
        return response.data as Client;
      }),
      catchError(error => {
        console.error('Error adding client:', error);
        throw error;
      })
    );
  }

  /**
   * Update a client
   */
  updateClient(id: string, updates: Partial<Client>): Observable<Client> {
    return from(
      this.supabase
        .from('clients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to update client: ${response.error.message}`);
        }
        return response.data as Client;
      }),
      catchError(error => {
        console.error('Error updating client:', error);
        throw error;
      })
    );
  }

  /**
   * Delete a client
   */
  deleteClient(id: string): Observable<void> {
    return from(
      this.supabase
        .from('clients')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(`Failed to delete client: ${response.error.message}`);
        }
      }),
      catchError(error => {
        console.error('Error deleting client:', error);
        throw error;
      })
    );
  }
}