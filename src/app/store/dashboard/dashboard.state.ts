import {
  SummaryCard,
  PerformanceChartData,
  FunnelChartData,
  QuickOverviewMetric,
  ClientEntry,
} from '../../shared/models/dashboard.models';

export interface DashboardState {
  // Data
  summaryCards: SummaryCard[];
  performanceData: PerformanceChartData[];
  funnelData: FunnelChartData[];
  recentOutreach: QuickOverviewMetric[];
  engagementTypes: QuickOverviewMetric[];
  todaySchedule: QuickOverviewMetric[];
  performanceMetrics: QuickOverviewMetric[];
  clients: ClientEntry[];

  // UI State
  loading: boolean;
  error: string | null;

  // Individual loading states for different data types
  loadingStates: {
    summaryCards: boolean;
    performanceData: boolean;
    funnelData: boolean;
    quickOverview: boolean;
    clients: boolean;
    addingClient: boolean;
    updatingClient: boolean;
    deletingClient: boolean;
  };
}

export const initialDashboardState: DashboardState = {
  // Data
  summaryCards: [],
  performanceData: [],
  funnelData: [],
  recentOutreach: [],
  engagementTypes: [],
  todaySchedule: [],
  performanceMetrics: [],
  clients: [],

  // UI State
  loading: false,
  error: null,

  // Individual loading states
  loadingStates: {
    summaryCards: false,
    performanceData: false,
    funnelData: false,
    quickOverview: false,
    clients: false,
    addingClient: false,
    updatingClient: false,
    deletingClient: false,
  },
};
