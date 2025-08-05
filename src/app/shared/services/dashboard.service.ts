import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, map, catchError, forkJoin, of } from 'rxjs';
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
  DashboardDataTransformer,
} from '../models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = this.createSupabaseClient();
  }

  private createSupabaseClient(): SupabaseClient {
    return createClient(environment.supabase.url, environment.supabase.key);
  }

  /**
   * Get demo data for when database is not available
   */
  private getDemoData() {
    const demoSummaryCards: SummaryCard[] = [
      {
        title: 'Total Clients',
        value: '247',
        change: '+12% from last month',
        changeType: 'positive',
        icon: '/assets/icons/users.svg',
      },
      {
        title: 'Active Leads',
        value: '89',
        change: '+8% from last month',
        changeType: 'positive',
        icon: '/assets/icons/leads.svg',
      },
      {
        title: 'Conversions',
        value: '34',
        change: '+23% from last month',
        changeType: 'positive',
        icon: '/assets/icons/conversions.svg',
      },
      {
        title: 'Revenue Generated',
        value: '$125,430',
        change: '+15% from last month',
        changeType: 'positive',
        icon: '/assets/icons/revenue.svg',
      },
    ];

    const demoPerformanceData: PerformanceChartData[] = [
      { day: 'Mon', value: 45, secondaryValue: 12 },
      { day: 'Tue', value: 52, secondaryValue: 18 },
      { day: 'Wed', value: 48, secondaryValue: 15 },
      { day: 'Thu', value: 61, secondaryValue: 22 },
      { day: 'Fri', value: 55, secondaryValue: 19 },
      { day: 'Sat', value: 32, secondaryValue: 8 },
      { day: 'Sun', value: 28, secondaryValue: 6 },
    ];

    const demoFunnelData: FunnelChartData[] = [
      {
        label: 'Initial Contact',
        value: 1000,
        percentage: 100,
        color: '#3B82F6',
      },
      { label: 'Interested', value: 650, percentage: 65, color: '#10B981' },
      { label: 'Follow-up', value: 420, percentage: 42, color: '#F59E0B' },
      { label: 'Proposal Sent', value: 280, percentage: 28, color: '#EF4444' },
      { label: 'Converted', value: 150, percentage: 15, color: '#8B5CF6' },
    ];

    const demoRecentOutreach: QuickOverviewMetric[] = [
      { label: 'Emails Sent Today', value: '23', status: 'success' },
      { label: 'Calls Made', value: '8', status: 'success' },
      { label: 'LinkedIn Messages', value: '15', status: 'success' },
      { label: 'Follow-ups Pending', value: '12', status: 'warning' },
    ];

    const demoEngagementTypes: QuickOverviewMetric[] = [
      { label: 'Email Responses', value: '42%', status: 'success' },
      { label: 'Phone Pickups', value: '68%', status: 'success' },
      { label: 'Meeting Bookings', value: '24%', status: 'warning' },
      { label: 'Social Engagement', value: '31%', status: 'success' },
    ];

    const demoTodaySchedule: QuickOverviewMetric[] = [
      { label: 'Scheduled Calls', value: '5', status: 'success' },
      { label: 'Follow-up Emails', value: '12', status: 'warning' },
      { label: 'Proposals Due', value: '3', status: 'danger' },
      { label: 'Meetings Booked', value: '2', status: 'success' },
    ];

    const demoPerformanceMetrics: QuickOverviewMetric[] = [
      { label: 'Response Rate', value: '34%', status: 'success' },
      { label: 'Conversion Rate', value: '15%', status: 'success' },
      { label: 'Average Deal Size', value: '$3,680', status: 'success' },
      { label: 'Client Retention', value: '89%', status: 'success' },
    ];

    const demoClients: ClientEntry[] = [
      {
        id: '1',
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Interested',
        lastContact: '2 hours ago',
        method: 'Email',
        revenue: 15000,
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        company: 'Digital Marketing Pro',
        email: 'sarah@digitalmarketing.com',
        phone: '+1 (555) 987-6543',
        status: 'Follow-up',
        lastContact: '1 day ago',
        method: 'Phone',
        revenue: 8500,
      },
      {
        id: '3',
        name: 'Michael Chen',
        company: 'StartupXYZ',
        email: 'm.chen@startupxyz.io',
        phone: '+1 (555) 456-7890',
        status: 'Converted',
        lastContact: '3 days ago',
        method: 'Meeting',
        revenue: 25000,
      },
      {
        id: '4',
        name: 'Emily Rodriguez',
        company: 'Global Enterprises',
        email: 'e.rodriguez@global-ent.com',
        phone: '+1 (555) 234-5678',
        status: 'Initial Contact',
        lastContact: '5 hours ago',
        method: 'LinkedIn',
        revenue: 0,
      },
      {
        id: '5',
        name: 'David Thompson',
        company: 'Innovation Labs',
        email: 'david.t@innovationlabs.net',
        phone: '+1 (555) 345-6789',
        status: 'Not Interested',
        lastContact: '1 week ago',
        method: 'Email',
        revenue: 0,
      },
    ];

    return {
      summaryCards: demoSummaryCards,
      performanceData: demoPerformanceData,
      funnelData: demoFunnelData,
      recentOutreach: demoRecentOutreach,
      engagementTypes: demoEngagementTypes,
      todaySchedule: demoTodaySchedule,
      performanceMetrics: demoPerformanceMetrics,
      clients: demoClients,
    };
  }

  /**
   * Get all summary cards data
   */
  getSummaryCards(): Observable<SummaryCard[]> {
    return from(
      this.supabase.from('summary_metrics').select('*').order('metric_type'),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(
            `Failed to fetch summary metrics: ${response.error.message}`,
          );
        }
        return (response.data as SummaryMetric[]).map((metric) =>
          DashboardDataTransformer.summaryMetricToCard(metric),
        );
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          'Database unavailable, using demo data for summary cards:',
          error,
        );
        return of(this.getDemoData().summaryCards);
      }),
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
        .order('week_start_date', { ascending: true }),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(
            `Failed to fetch performance data: ${response.error.message}`,
          );
        }
        return DashboardDataTransformer.performanceDataToChart(
          response.data as PerformanceData[],
        );
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          'Database unavailable, using demo data for performance chart:',
          error,
        );
        return of(this.getDemoData().performanceData);
      }),
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
        .order('stage_order', { ascending: true }),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(
            `Failed to fetch funnel data: ${response.error.message}`,
          );
        }
        return DashboardDataTransformer.funnelDataToChart(
          response.data as FunnelData[],
        );
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          'Database unavailable, using demo data for funnel chart:',
          error,
        );
        return of(this.getDemoData().funnelData);
      }),
    );
  }

  /**
   * Get quick metrics by category
   */
  getQuickMetricsByCategory(
    category: string,
  ): Observable<QuickOverviewMetric[]> {
    return from(
      this.supabase
        .from('quick_metrics')
        .select('*')
        .eq('category', category)
        .order('label'),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(
            `Failed to fetch quick metrics for ${category}: ${response.error.message}`,
          );
        }
        return DashboardDataTransformer.quickMetricsToOverview(
          response.data as QuickMetric[],
        );
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          `Database unavailable, using demo data for ${category}:`,
          error,
        );
        const demoData = this.getDemoData();
        switch (category) {
          case 'recent_outreach':
            return of(demoData.recentOutreach);
          case 'engagement_types':
            return of(demoData.engagementTypes);
          case 'today_schedule':
            return of(demoData.todaySchedule);
          case 'performance_metrics':
            return of(demoData.performanceMetrics);
          default:
            return of([]);
        }
      }),
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
      performanceMetrics: this.getQuickMetricsByCategory('performance_metrics'),
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
        .order('last_contact', { ascending: false }),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(`Failed to fetch clients: ${response.error.message}`);
        }
        return (response.data as Client[]).map((client) =>
          DashboardDataTransformer.clientToEntry(client),
        );
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          'Database unavailable, using demo data for clients:',
          error,
        );
        return of(this.getDemoData().clients);
      }),
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
      clients: this.getClients(),
    }).pipe(
      map((result) => ({
        summaryCards: result.summaryCards,
        performanceData: result.performanceData,
        funnelData: result.funnelData,
        recentOutreach: result.quickOverview.recentOutreach,
        engagementTypes: result.quickOverview.engagementTypes,
        todaySchedule: result.quickOverview.todaySchedule,
        performanceMetrics: result.quickOverview.performanceMetrics,
        clients: result.clients,
      })),
    );
  }

  /**
   * Add a new client
   */
  addClient(
    client: Omit<Client, 'id' | 'created_at' | 'updated_at'>,
  ): Observable<Client> {
    return from(
      this.supabase.from('clients').insert(client).select().single(),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(`Failed to add client: ${response.error.message}`);
        }
        return response.data as Client;
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          'Database unavailable, simulating successful client addition:',
          error,
        );
        // Return a mock client response when database is unavailable
        const mockClient: Client = {
          id: `demo-${Date.now()}`,
          ...client,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return of(mockClient);
      }),
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
        .single(),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(`Failed to update client: ${response.error.message}`);
        }
        return response.data as Client;
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          'Database unavailable, simulating successful client update:',
          error,
        );
        // Return a mock updated client response when database is unavailable
        const mockUpdatedClient: Client = {
          id,
          name: updates.name || 'Updated Client',
          company: updates.company || 'Updated Company',
          email: updates.email || 'updated@example.com',
          phone: updates.phone || '',
          status: updates.status || 'Initial Contact',
          contact_method: updates.contact_method || 'Email',
          revenue: updates.revenue || 0,
          last_contact: updates.last_contact || new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return of(mockUpdatedClient);
      }),
    );
  }

  /**
   * Delete a client
   */
  deleteClient(id: string): Observable<void> {
    return from(this.supabase.from('clients').delete().eq('id', id)).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(`Failed to delete client: ${response.error.message}`);
        }
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.warn(
          'Database unavailable, simulating successful client deletion:',
          error,
        );
        // Return successful completion when database is unavailable
        return of(undefined);
      }),
    );
  }
}
