import { createReducer, on } from '@ngrx/store';
import { initialDashboardState } from './dashboard.state';
import * as DashboardActions from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialDashboardState,

  // Load Dashboard Data
  on(DashboardActions.loadDashboardData, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboardDataSuccess, (state, action) => ({
    ...state,
    summaryCards: action.summaryCards,
    performanceData: action.performanceData,
    funnelData: action.funnelData,
    recentOutreach: action.recentOutreach,
    engagementTypes: action.engagementTypes,
    todaySchedule: action.todaySchedule,
    performanceMetrics: action.performanceMetrics,
    clients: action.clients,
    loading: false,
    error: null,
  })),

  on(DashboardActions.loadDashboardDataFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // Summary Cards
  on(DashboardActions.loadSummaryCards, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      summaryCards: true,
    },
    error: null,
  })),

  on(DashboardActions.loadSummaryCardsSuccess, (state, action) => ({
    ...state,
    summaryCards: action.summaryCards,
    loadingStates: {
      ...state.loadingStates,
      summaryCards: false,
    },
    error: null,
  })),

  on(DashboardActions.loadSummaryCardsFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      summaryCards: false,
    },
    error: action.error,
  })),

  // Performance Data
  on(DashboardActions.loadPerformanceData, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      performanceData: true,
    },
    error: null,
  })),

  on(DashboardActions.loadPerformanceDataSuccess, (state, action) => ({
    ...state,
    performanceData: action.performanceData,
    loadingStates: {
      ...state.loadingStates,
      performanceData: false,
    },
    error: null,
  })),

  on(DashboardActions.loadPerformanceDataFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      performanceData: false,
    },
    error: action.error,
  })),

  // Funnel Data
  on(DashboardActions.loadFunnelData, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      funnelData: true,
    },
    error: null,
  })),

  on(DashboardActions.loadFunnelDataSuccess, (state, action) => ({
    ...state,
    funnelData: action.funnelData,
    loadingStates: {
      ...state.loadingStates,
      funnelData: false,
    },
    error: null,
  })),

  on(DashboardActions.loadFunnelDataFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      funnelData: false,
    },
    error: action.error,
  })),

  // Quick Overview Data
  on(DashboardActions.loadQuickOverviewData, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      quickOverview: true,
    },
    error: null,
  })),

  on(DashboardActions.loadQuickOverviewDataSuccess, (state, action) => ({
    ...state,
    recentOutreach: action.recentOutreach,
    engagementTypes: action.engagementTypes,
    todaySchedule: action.todaySchedule,
    performanceMetrics: action.performanceMetrics,
    loadingStates: {
      ...state.loadingStates,
      quickOverview: false,
    },
    error: null,
  })),

  on(DashboardActions.loadQuickOverviewDataFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      quickOverview: false,
    },
    error: action.error,
  })),

  // Clients
  on(DashboardActions.loadClients, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      clients: true,
    },
    error: null,
  })),

  on(DashboardActions.loadClientsSuccess, (state, action) => ({
    ...state,
    clients: action.clients,
    loadingStates: {
      ...state.loadingStates,
      clients: false,
    },
    error: null,
  })),

  on(DashboardActions.loadClientsFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      clients: false,
    },
    error: action.error,
  })),

  // Add Client
  on(DashboardActions.addClient, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      addingClient: true,
    },
    error: null,
  })),

  on(DashboardActions.addClientSuccess, (state, action) => ({
    ...state,
    clients: [
      ...state.clients,
      {
        id: action.client.id,
        name: action.client.name,
        company: action.client.company,
        email: action.client.email,
        phone: action.client.phone || '',
        status: action.client.status,
        lastContact: action.client.last_contact,
        method: action.client.contact_method,
        revenue: action.client.revenue,
      },
    ],
    loadingStates: {
      ...state.loadingStates,
      addingClient: false,
    },
    error: null,
  })),

  on(DashboardActions.addClientFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      addingClient: false,
    },
    error: action.error,
  })),

  // Update Client
  on(DashboardActions.updateClient, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      updatingClient: true,
    },
    error: null,
  })),

  on(DashboardActions.updateClientSuccess, (state, action) => ({
    ...state,
    clients: state.clients.map((client) =>
      client.id === action.client.id
        ? {
            id: action.client.id,
            name: action.client.name,
            company: action.client.company,
            email: action.client.email,
            phone: action.client.phone || '',
            status: action.client.status,
            lastContact: action.client.last_contact,
            method: action.client.contact_method,
            revenue: action.client.revenue,
          }
        : client,
    ),
    loadingStates: {
      ...state.loadingStates,
      updatingClient: false,
    },
    error: null,
  })),

  on(DashboardActions.updateClientFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      updatingClient: false,
    },
    error: action.error,
  })),

  // Delete Client
  on(DashboardActions.deleteClient, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      deletingClient: true,
    },
    error: null,
  })),

  on(DashboardActions.deleteClientSuccess, (state, action) => ({
    ...state,
    clients: state.clients.filter((client) => client.id !== action.id),
    loadingStates: {
      ...state.loadingStates,
      deletingClient: false,
    },
    error: null,
  })),

  on(DashboardActions.deleteClientFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      deletingClient: false,
    },
    error: action.error,
  })),

  // UI State
  on(DashboardActions.setLoading, (state, action) => ({
    ...state,
    loading: action.loading,
  })),

  on(DashboardActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
