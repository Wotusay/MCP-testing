import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { DashboardService } from '../../shared/services/dashboard.service';
import * as DashboardActions from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);

  // Load all dashboard data
  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboardData),
      switchMap(() =>
        this.dashboardService.getAllDashboardData().pipe(
          map((data) =>
            DashboardActions.loadDashboardDataSuccess({
              summaryCards: data.summaryCards,
              performanceData: data.performanceData,
              funnelData: data.funnelData,
              recentOutreach: data.recentOutreach,
              engagementTypes: data.engagementTypes,
              todaySchedule: data.todaySchedule,
              performanceMetrics: data.performanceMetrics,
              clients: data.clients,
            }),
          ),
          catchError((error) =>
            of(
              DashboardActions.loadDashboardDataFailure({
                error: error.message || 'Failed to load dashboard data',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load summary cards
  loadSummaryCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadSummaryCards),
      switchMap(() =>
        this.dashboardService.getSummaryCards().pipe(
          map((summaryCards) =>
            DashboardActions.loadSummaryCardsSuccess({ summaryCards }),
          ),
          catchError((error) =>
            of(
              DashboardActions.loadSummaryCardsFailure({
                error: error.message || 'Failed to load summary cards',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load performance data
  loadPerformanceData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadPerformanceData),
      switchMap(() =>
        this.dashboardService.getPerformanceData().pipe(
          map((performanceData) =>
            DashboardActions.loadPerformanceDataSuccess({ performanceData }),
          ),
          catchError((error) =>
            of(
              DashboardActions.loadPerformanceDataFailure({
                error: error.message || 'Failed to load performance data',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load funnel data
  loadFunnelData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadFunnelData),
      switchMap(() =>
        this.dashboardService.getFunnelData().pipe(
          map((funnelData) =>
            DashboardActions.loadFunnelDataSuccess({ funnelData }),
          ),
          catchError((error) =>
            of(
              DashboardActions.loadFunnelDataFailure({
                error: error.message || 'Failed to load funnel data',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load quick overview data
  loadQuickOverviewData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadQuickOverviewData),
      switchMap(() =>
        this.dashboardService.getQuickOverviewData().pipe(
          map((data) =>
            DashboardActions.loadQuickOverviewDataSuccess({
              recentOutreach: data.recentOutreach,
              engagementTypes: data.engagementTypes,
              todaySchedule: data.todaySchedule,
              performanceMetrics: data.performanceMetrics,
            }),
          ),
          catchError((error) =>
            of(
              DashboardActions.loadQuickOverviewDataFailure({
                error: error.message || 'Failed to load quick overview data',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load clients
  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadClients),
      switchMap(() =>
        this.dashboardService.getClients().pipe(
          map((clients) => DashboardActions.loadClientsSuccess({ clients })),
          catchError((error) =>
            of(
              DashboardActions.loadClientsFailure({
                error: error.message || 'Failed to load clients',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Add client
  addClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.addClient),
      mergeMap((action) =>
        this.dashboardService.addClient(action.client).pipe(
          map((client) => DashboardActions.addClientSuccess({ client })),
          catchError((error) =>
            of(
              DashboardActions.addClientFailure({
                error: error.message || 'Failed to add client',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Update client
  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.updateClient),
      mergeMap((action) =>
        this.dashboardService.updateClient(action.id, action.updates).pipe(
          map((client) => DashboardActions.updateClientSuccess({ client })),
          catchError((error) =>
            of(
              DashboardActions.updateClientFailure({
                error: error.message || 'Failed to update client',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Delete client
  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.deleteClient),
      mergeMap((action) =>
        this.dashboardService.deleteClient(action.id).pipe(
          map(() => DashboardActions.deleteClientSuccess({ id: action.id })),
          catchError((error) =>
            of(
              DashboardActions.deleteClientFailure({
                error: error.message || 'Failed to delete client',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
