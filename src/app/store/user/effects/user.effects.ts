import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { User } from '../actions/user.actions';
import * as UserActions from '../actions/user.actions';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/users';

  // Load Users effect
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.http.get<User[]>(this.apiUrl).pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => {
            // eslint-disable-next-line no-console
            console.error('Error fetching users:', error);
            return of(
              UserActions.loadUsersFailure({
                error: error.message || 'Failed to load users',
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Load User by ID effect
  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserById),
      switchMap((action) =>
        this.http.get<User>(`${this.apiUrl}/${action.id}`).pipe(
          map((user) => UserActions.loadUserByIdSuccess({ user })),
          catchError((error) => {
            // eslint-disable-next-line no-console
            console.error('Error fetching user:', error);
            return of(
              UserActions.loadUserByIdFailure({
                error: error.message || 'Failed to load user',
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Create User effect
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      mergeMap((action) =>
        this.http.post<User>(this.apiUrl, action.user).pipe(
          map((user) => UserActions.createUserSuccess({ user })),
          catchError((error) => {
            // eslint-disable-next-line no-console
            console.error('Error creating user:', error);
            return of(
              UserActions.createUserFailure({
                error: error.message || 'Failed to create user',
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Update User effect
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) =>
        this.http.put<User>(`${this.apiUrl}/${action.id}`, action.user).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) => {
            // eslint-disable-next-line no-console
            console.error('Error updating user:', error);
            return of(
              UserActions.updateUserFailure({
                error: error.message || 'Failed to update user',
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Delete User effect
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap((action) =>
        this.http.delete(`${this.apiUrl}/${action.id}`).pipe(
          map(() => UserActions.deleteUserSuccess({ id: action.id })),
          catchError((error) => {
            // eslint-disable-next-line no-console
            console.error('Error deleting user:', error);
            return of(
              UserActions.deleteUserFailure({
                error: error.message || 'Failed to delete user',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
