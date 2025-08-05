import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';

// Feature selector
export const selectDashboardState =
  createFeatureSelector<DashboardState>('dashboard');

// Data selectors
export const selectSummaryCards = createSelector(
  selectDashboardState,
  (state) => state.summaryCards,
);

export const selectPerformanceData = createSelector(
  selectDashboardState,
  (state) => state.performanceData,
);

export const selectFunnelData = createSelector(
  selectDashboardState,
  (state) => state.funnelData,
);

export const selectRecentOutreach = createSelector(
  selectDashboardState,
  (state) => state.recentOutreach,
);

export const selectEngagementTypes = createSelector(
  selectDashboardState,
  (state) => state.engagementTypes,
);

export const selectTodaySchedule = createSelector(
  selectDashboardState,
  (state) => state.todaySchedule,
);

export const selectPerformanceMetrics = createSelector(
  selectDashboardState,
  (state) => state.performanceMetrics,
);

export const selectClients = createSelector(
  selectDashboardState,
  (state) => state.clients,
);

// UI state selectors
export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) => state.loading,
);

export const selectDashboardError = createSelector(
  selectDashboardState,
  (state) => state.error,
);

export const selectLoadingStates = createSelector(
  selectDashboardState,
  (state) => state.loadingStates,
);

// Specific loading state selectors
export const selectSummaryCardsLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.summaryCards,
);

export const selectPerformanceDataLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.performanceData,
);

export const selectFunnelDataLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.funnelData,
);

export const selectQuickOverviewLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.quickOverview,
);

export const selectClientsLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.clients,
);

export const selectAddingClient = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.addingClient,
);

export const selectUpdatingClient = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.updatingClient,
);

export const selectDeletingClient = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.deletingClient,
);

// Composite selectors
export const selectQuickOverviewData = createSelector(
  selectRecentOutreach,
  selectEngagementTypes,
  selectTodaySchedule,
  selectPerformanceMetrics,
  (recentOutreach, engagementTypes, todaySchedule, performanceMetrics) => ({
    recentOutreach,
    engagementTypes,
    todaySchedule,
    performanceMetrics,
  }),
);

export const selectAllDashboardData = createSelector(
  selectSummaryCards,
  selectPerformanceData,
  selectFunnelData,
  selectQuickOverviewData,
  selectClients,
  (summaryCards, performanceData, funnelData, quickOverview, clients) => ({
    summaryCards,
    performanceData,
    funnelData,
    recentOutreach: quickOverview.recentOutreach,
    engagementTypes: quickOverview.engagementTypes,
    todaySchedule: quickOverview.todaySchedule,
    performanceMetrics: quickOverview.performanceMetrics,
    clients,
  }),
);

// Client-specific selectors
export const selectClientById = (clientId: string) =>
  createSelector(selectClients, (clients) =>
    clients.find((client) => client.id === clientId),
  );

export const selectClientsByStatus = (status: string) =>
  createSelector(selectClients, (clients) =>
    clients.filter((client) => client.status === status),
  );

export const selectClientsCount = createSelector(
  selectClients,
  (clients) => clients.length,
);

// Dashboard state checking selectors
export const selectIsAnyDataLoading = createSelector(
  selectDashboardLoading,
  selectLoadingStates,
  (generalLoading, loadingStates) =>
    generalLoading ||
    loadingStates.summaryCards ||
    loadingStates.performanceData ||
    loadingStates.funnelData ||
    loadingStates.quickOverview ||
    loadingStates.clients,
);

export const selectHasData = createSelector(
  selectSummaryCards,
  selectPerformanceData,
  selectFunnelData,
  selectClients,
  (summaryCards, performanceData, funnelData, clients) =>
    summaryCards.length > 0 ||
    performanceData.length > 0 ||
    funnelData.length > 0 ||
    clients.length > 0,
);

export const selectDashboardStatus = createSelector(
  selectIsAnyDataLoading,
  selectDashboardError,
  selectHasData,
  (loading, error, hasData) => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (hasData) return 'loaded';
    return 'empty';
  },
);
