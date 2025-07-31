/**
 * Dashboard data models for Supabase integration
 */

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status:
    | 'Interested'
    | 'Follow-up'
    | 'Converted'
    | 'Initial Contact'
    | 'Not Interested';
  last_contact: string;
  contact_method: 'Email' | 'Phone' | 'Meeting' | 'LinkedIn';
  revenue: number;
  created_at?: string;
  updated_at?: string;
}

export interface SummaryMetric {
  id: string;
  metric_type: string;
  title: string;
  value: string;
  change_percentage?: number;
  change_type?: 'positive' | 'negative';
  icon_path?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PerformanceData {
  id: string;
  day_of_week: string;
  outreach_attempts: number;
  responses: number;
  week_start_date: string;
  created_at?: string;
}

export interface FunnelData {
  id: string;
  stage_label: string;
  stage_value: number;
  stage_percentage: number;
  stage_color: string;
  stage_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuickMetric {
  id: string;
  category:
    | 'recent_outreach'
    | 'engagement_types'
    | 'today_schedule'
    | 'performance_metrics';
  label: string;
  value: string;
  status?: 'success' | 'warning' | 'danger';
  created_at?: string;
  updated_at?: string;
}

// Legacy interfaces for backward compatibility with existing components
export interface SummaryCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}

export interface PerformanceChartData {
  day: string;
  value: number;
  secondaryValue: number;
}

export interface FunnelChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface QuickOverviewMetric {
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

// Transformation functions
export class DashboardDataTransformer {
  static summaryMetricToCard(metric: SummaryMetric): SummaryCard {
    const changeSign = metric.change_type === 'positive' ? '+' : '';
    const changeText = metric.change_percentage
      ? `${changeSign}${metric.change_percentage}% from last month`
      : 'No change data';

    return {
      title: metric.title,
      value: metric.value,
      change: changeText,
      changeType: metric.change_type || 'positive',
      icon: metric.icon_path || '',
    };
  }

  static performanceDataToChart(
    data: PerformanceData[],
  ): PerformanceChartData[] {
    return data.map((item) => ({
      day: item.day_of_week,
      value: item.outreach_attempts,
      secondaryValue: item.responses,
    }));
  }

  static funnelDataToChart(data: FunnelData[]): FunnelChartData[] {
    return data
      .sort((a, b) => a.stage_order - b.stage_order)
      .map((item) => ({
        label: item.stage_label,
        value: item.stage_value,
        percentage: item.stage_percentage,
        color: item.stage_color,
      }));
  }

  static quickMetricsToOverview(metrics: QuickMetric[]): QuickOverviewMetric[] {
    return metrics.map((metric) => ({
      label: metric.label,
      value: metric.value,
      status: metric.status,
    }));
  }

  static clientToEntry(client: Client): ClientEntry {
    return {
      id: client.id,
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone || '',
      status: client.status,
      lastContact: this.formatLastContact(client.last_contact),
      method: client.contact_method,
      revenue: client.revenue,
    };
  }

  private static formatLastContact(lastContact: string): string {
    const now = new Date();
    const contactDate = new Date(lastContact);
    const diffMs = now.getTime() - contactDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Less than an hour ago';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    }
  }
}
