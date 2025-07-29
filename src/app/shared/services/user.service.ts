import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoggingService } from './logging.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();
  private http = inject(HttpClient);
  private logger = inject(LoggingService);

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    this.logger.logHttpRequest('GET', this.apiUrl);

    return this.http.get<User[]>(this.apiUrl).pipe(
      tap((users) => {
        this.logger.logHttpResponse('GET', this.apiUrl, 200, {
          count: users.length,
        });
        this.usersSubject.next(users);
      }),
      catchError((error) => {
        this.logger.error('Error fetching users', error, 'USER_SERVICE');
        return of([]);
      }),
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<User | null> {
    const url = `${this.apiUrl}/${id}`;
    this.logger.logHttpRequest('GET', url);

    return this.http.get<User>(url).pipe(
      tap((user) => {
        this.logger.logHttpResponse('GET', url, 200, { userId: user.id });
      }),
      catchError((error) => {
        this.logger.error(`Error fetching user ${id}`, error, 'USER_SERVICE');
        return of(null);
      }),
    );
  }

  /**
   * Create new user
   */
  createUser(user: Omit<User, 'id'>): Observable<User> {
    this.logger.logHttpRequest('POST', this.apiUrl, user);

    return this.http.post<User>(this.apiUrl, user).pipe(
      tap((newUser) => {
        this.logger.logHttpResponse('POST', this.apiUrl, 201, {
          userId: newUser.id,
        });
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
        this.logger.info(
          `User created successfully`,
          { userId: newUser.id },
          'USER_SERVICE',
        );
      }),
    );
  }

  /**
   * Update existing user
   */
  updateUser(id: number, user: Partial<User>): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    this.logger.logHttpRequest('PUT', url, user);

    return this.http.put<User>(url, user).pipe(
      tap((updatedUser) => {
        this.logger.logHttpResponse('PUT', url, 200, {
          userId: updatedUser.id,
        });
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersSubject.next([...currentUsers]);
        }
        this.logger.info(
          `User updated successfully`,
          { userId: updatedUser.id },
          'USER_SERVICE',
        );
      }),
    );
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    this.logger.logHttpRequest('DELETE', url);

    return this.http.delete(url).pipe(
      tap(() => {
        this.logger.logHttpResponse('DELETE', url, 200);
        const currentUsers = this.usersSubject.value;
        const filteredUsers = currentUsers.filter((u) => u.id !== id);
        this.usersSubject.next(filteredUsers);
        this.logger.info(
          `User deleted successfully`,
          { userId: id },
          'USER_SERVICE',
        );
      }),
      map(() => true),
      catchError((error) => {
        this.logger.error(`Error deleting user ${id}`, error, 'USER_SERVICE');
        return of(false);
      }),
    );
  }

  /**
   * Get active users only
   */
  getActiveUsers(): Observable<User[]> {
    return this.users$.pipe(
      map((users) => users.filter((user) => user.active)),
    );
  }
}
