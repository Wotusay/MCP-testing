import { createAction, props } from '@ngrx/store';
import {
  SummaryCard,
  PerformanceChartData,
  FunnelChartData,
  QuickOverviewMetric,
  ClientEntry,
  Client,
} from '../../shared/models/dashboard.models';

// Load Dashboard Data Actions
export const loadDashboardData = createAction(
  '[Dashboard] Load Dashboard Data',
);

export const loadDashboardDataSuccess = createAction(
  '[Dashboard] Load Dashboard Data Success',
  props<{
    summaryCards: SummaryCard[];
    performanceData: PerformanceChartData[];
    funnelData: FunnelChartData[];
    recentOutreach: QuickOverviewMetric[];
    engagementTypes: QuickOverviewMetric[];
    todaySchedule: QuickOverviewMetric[];
    performanceMetrics: QuickOverviewMetric[];
    clients: ClientEntry[];
  }>(),
);

export const loadDashboardDataFailure = createAction(
  '[Dashboard] Load Dashboard Data Failure',
  props<{ error: string }>(),
);

// Summary Cards Actions
export const loadSummaryCards = createAction('[Dashboard] Load Summary Cards');

export const loadSummaryCardsSuccess = createAction(
  '[Dashboard] Load Summary Cards Success',
  props<{ summaryCards: SummaryCard[] }>(),
);

export const loadSummaryCardsFailure = createAction(
  '[Dashboard] Load Summary Cards Failure',
  props<{ error: string }>(),
);

// Performance Data Actions
export const loadPerformanceData = createAction(
  '[Dashboard] Load Performance Data',
);

export const loadPerformanceDataSuccess = createAction(
  '[Dashboard] Load Performance Data Success',
  props<{ performanceData: PerformanceChartData[] }>(),
);

export const loadPerformanceDataFailure = createAction(
  '[Dashboard] Load Performance Data Failure',
  props<{ error: string }>(),
);

// Funnel Data Actions
export const loadFunnelData = createAction('[Dashboard] Load Funnel Data');

export const loadFunnelDataSuccess = createAction(
  '[Dashboard] Load Funnel Data Success',
  props<{ funnelData: FunnelChartData[] }>(),
);

export const loadFunnelDataFailure = createAction(
  '[Dashboard] Load Funnel Data Failure',
  props<{ error: string }>(),
);

// Quick Overview Data Actions
export const loadQuickOverviewData = createAction(
  '[Dashboard] Load Quick Overview Data',
);

export const loadQuickOverviewDataSuccess = createAction(
  '[Dashboard] Load Quick Overview Data Success',
  props<{
    recentOutreach: QuickOverviewMetric[];
    engagementTypes: QuickOverviewMetric[];
    todaySchedule: QuickOverviewMetric[];
    performanceMetrics: QuickOverviewMetric[];
  }>(),
);

export const loadQuickOverviewDataFailure = createAction(
  '[Dashboard] Load Quick Overview Data Failure',
  props<{ error: string }>(),
);

// Clients Actions
export const loadClients = createAction('[Dashboard] Load Clients');

export const loadClientsSuccess = createAction(
  '[Dashboard] Load Clients Success',
  props<{ clients: ClientEntry[] }>(),
);

export const loadClientsFailure = createAction(
  '[Dashboard] Load Clients Failure',
  props<{ error: string }>(),
);

// Add Client Actions
export const addClient = createAction(
  '[Dashboard] Add Client',
  props<{ client: Omit<Client, 'id' | 'created_at' | 'updated_at'> }>(),
);

export const addClientSuccess = createAction(
  '[Dashboard] Add Client Success',
  props<{ client: Client }>(),
);

export const addClientFailure = createAction(
  '[Dashboard] Add Client Failure',
  props<{ error: string }>(),
);

// Update Client Actions
export const updateClient = createAction(
  '[Dashboard] Update Client',
  props<{ id: string; updates: Partial<Client> }>(),
);

export const updateClientSuccess = createAction(
  '[Dashboard] Update Client Success',
  props<{ client: Client }>(),
);

export const updateClientFailure = createAction(
  '[Dashboard] Update Client Failure',
  props<{ error: string }>(),
);

// Delete Client Actions
export const deleteClient = createAction(
  '[Dashboard] Delete Client',
  props<{ id: string }>(),
);

export const deleteClientSuccess = createAction(
  '[Dashboard] Delete Client Success',
  props<{ id: string }>(),
);

export const deleteClientFailure = createAction(
  '[Dashboard] Delete Client Failure',
  props<{ error: string }>(),
);

// UI State Actions
export const setLoading = createAction(
  '[Dashboard] Set Loading',
  props<{ loading: boolean }>(),
);

export const clearError = createAction('[Dashboard] Clear Error');
