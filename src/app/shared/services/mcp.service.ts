import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoggingService } from './logging.service';
import { ErrorHandlingService } from './error-handling.service';

/**
 * MCP (Model-Controller-Protocol) Service for Supabase database interactions
 * This service provides a unified interface for all database operations
 */
@Injectable({
  providedIn: 'root',
})
export class McpService {
  private readonly supabase: SupabaseClient;
  private readonly logger = inject(LoggingService);
  private readonly errorHandler = inject(ErrorHandlingService);

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
    );
  }

  /**
   * Generic query method for SELECT operations
   */
  query<T>(
    table: string,
    columns: string = '*',
    filters?: Record<string, unknown>,
  ): Observable<T[]> {
    this.logger.debug(`MCP Query: ${table}`, { columns, filters });

    let query = this.supabase.from(table).select(columns);

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return from(query).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as T[];
      }),
      catchError((error) => {
        const appError = this.errorHandler.handleError(error, {
          category: 'system',
          context: { operation: 'query', table, columns, filters },
          showToUser: false,
        });
        this.logger.error(`MCP Query failed: ${table}`, { error, appError });
        return throwError(() => appError);
      }),
    );
  }

  /**
   * Insert data into a table
   */
  insert<T>(table: string, data: Partial<T>[]): Observable<T[]> {
    this.logger.debug(`MCP Insert: ${table}`, { recordCount: data.length });

    return from(this.supabase.from(table).insert(data).select()).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as T[];
      }),
      catchError((error) => {
        const appError = this.errorHandler.handleError(error, {
          category: 'system',
          context: { operation: 'insert', table, data },
          showToUser: true,
        });
        this.logger.error(`MCP Insert failed: ${table}`, { error, appError });
        return throwError(() => appError);
      }),
    );
  }

  /**
   * Update data in a table
   */
  update<T>(
    table: string,
    data: Partial<T>,
    filters: Record<string, unknown>,
  ): Observable<T[]> {
    this.logger.debug(`MCP Update: ${table}`, { data, filters });

    let query = this.supabase.from(table).update(data);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    return from(query.select()).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as T[];
      }),
      catchError((error) => {
        const appError = this.errorHandler.handleError(error, {
          category: 'system',
          context: { operation: 'update', table, data, filters },
          showToUser: true,
        });
        this.logger.error(`MCP Update failed: ${table}`, { error, appError });
        return throwError(() => appError);
      }),
    );
  }

  /**
   * Delete data from a table
   */
  delete<T>(table: string, filters: Record<string, unknown>): Observable<T[]> {
    this.logger.debug(`MCP Delete: ${table}`, { filters });

    let query = this.supabase.from(table).delete();

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    return from(query.select()).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as T[];
      }),
      catchError((error) => {
        const appError = this.errorHandler.handleError(error, {
          category: 'system',
          context: { operation: 'delete', table, filters },
          showToUser: true,
        });
        this.logger.error(`MCP Delete failed: ${table}`, { error, appError });
        return throwError(() => appError);
      }),
    );
  }

  /**
   * Execute a custom RPC (Remote Procedure Call) function
   */
  rpc<T>(
    functionName: string,
    params?: Record<string, unknown>,
  ): Observable<T> {
    this.logger.debug(`MCP RPC: ${functionName}`, { params });

    return from(this.supabase.rpc(functionName, params)).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as T;
      }),
      catchError((error) => {
        const appError = this.errorHandler.handleError(error, {
          category: 'system',
          context: { operation: 'rpc', functionName, params },
          showToUser: false,
        });
        this.logger.error(`MCP RPC failed: ${functionName}`, {
          error,
          appError,
        });
        return throwError(() => appError);
      }),
    );
  }

  /**
   * Get the raw Supabase client for advanced operations
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Health check method to verify database connectivity
   */
  healthCheck(): Observable<boolean> {
    this.logger.debug('MCP Health check initiated');

    return from(this.supabase.from('clients').select('id').limit(1)).pipe(
      map((response) => {
        if (response.error) {
          this.logger.warn('MCP Health check failed', {
            error: response.error,
          });
          return false;
        }
        this.logger.debug('MCP Health check passed');
        return true;
      }),
      catchError((error) => {
        this.logger.error('MCP Health check error', { error });
        return from([false]);
      }),
    );
  }
}
