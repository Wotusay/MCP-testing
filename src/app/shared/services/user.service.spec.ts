import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserService, User } from './user.service';
import { MockDataFactory } from '../testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, provideZonelessChangeDetection()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch users and update users subject', (done) => {
      const mockUsers: User[] = [
        MockDataFactory.createUser({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          active: true,
        }),
        MockDataFactory.createUser({
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          active: false,
        }),
      ];

      // Subscribe to the observable first
      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);

        // Verify the users$ observable is updated
        service.users$.subscribe((users) => {
          expect(users).toEqual(mockUsers);
          done();
        });
      });

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle errors and return empty array', (done) => {
      spyOn(console, 'error');

      service.getUsers().subscribe((users) => {
        expect(users).toEqual([]);
        // eslint-disable-next-line no-console
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching users:',
          jasmine.any(Object),
        );
        done();
      });

      const req = httpMock.expectOne('/api/users');
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id', () => {
      const mockUser = MockDataFactory.createUser({ id: 1, name: 'John Doe' });

      service.getUserById(1).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle errors and return null', () => {
      spyOn(console, 'error');

      service.getUserById(1).subscribe((user) => {
        expect(user).toBeNull();
      });

      const req = httpMock.expectOne('/api/users/1');
      req.error(new ProgressEvent('Network error'));

      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching user:',
        jasmine.any(Object),
      );
    });
  });

  describe('createUser', () => {
    it('should create user and update users list', (done) => {
      const newUserData = {
        name: 'New User',
        email: 'new@example.com',
        active: true,
      };
      const createdUser = MockDataFactory.createUser({ id: 3, ...newUserData });

      // First populate some users
      const existingUsers = [
        MockDataFactory.createUser({ id: 1 }),
        MockDataFactory.createUser({ id: 2 }),
      ];
      service['usersSubject'].next(existingUsers);

      service.createUser(newUserData).subscribe((user) => {
        expect(user).toEqual(createdUser);

        // Verify users list is updated - wait a tick for the next to complete
        setTimeout(() => {
          service.users$.subscribe((users) => {
            expect(users.length).toBe(3);
            expect(users).toContain(createdUser);
            done();
          });
        }, 0);
      });

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUserData);
      req.flush(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should update user and update users list', (done) => {
      const existingUsers = [
        MockDataFactory.createUser({ id: 1, name: 'Original Name' }),
        MockDataFactory.createUser({ id: 2 }),
      ];
      service['usersSubject'].next(existingUsers);

      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...existingUsers[0], ...updateData };

      service.updateUser(1, updateData).subscribe((user) => {
        expect(user).toEqual(updatedUser);

        // Verify users list is updated - wait a tick for the next to complete
        setTimeout(() => {
          service.users$.subscribe((users) => {
            const user = users.find((u) => u.id === 1);
            expect(user?.name).toBe('Updated Name');
            done();
          });
        }, 0);
      });

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and update users list', (done) => {
      const existingUsers = [
        MockDataFactory.createUser({ id: 1 }),
        MockDataFactory.createUser({ id: 2 }),
      ];
      service['usersSubject'].next(existingUsers);

      service.deleteUser(1).subscribe((result) => {
        expect(result).toBe(true);

        // Verify users list is updated - wait a tick for the next to complete
        setTimeout(() => {
          service.users$.subscribe((users) => {
            expect(users.length).toBe(1);
            expect(users.find((u) => u.id === 1)).toBeUndefined();
            done();
          });
        }, 0);
      });

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle delete errors', (done) => {
      spyOn(console, 'error');

      service.deleteUser(1).subscribe((result) => {
        expect(result).toBe(false);
        // eslint-disable-next-line no-console
        expect(console.error).toHaveBeenCalledWith(
          'Error deleting user:',
          jasmine.any(Object),
        );
        done();
      });

      const req = httpMock.expectOne('/api/users/1');
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getActiveUsers', () => {
    it('should return only active users', () => {
      const allUsers = [
        MockDataFactory.createUser({ id: 1, active: true }),
        MockDataFactory.createUser({ id: 2, active: false }),
        MockDataFactory.createUser({ id: 3, active: true }),
      ];
      service['usersSubject'].next(allUsers);

      service.getActiveUsers().subscribe((activeUsers) => {
        expect(activeUsers.length).toBe(2);
        expect(activeUsers.every((user) => user.active)).toBe(true);
      });
    });

    it('should return empty array when no active users', () => {
      const allUsers = [
        MockDataFactory.createUser({ id: 1, active: false }),
        MockDataFactory.createUser({ id: 2, active: false }),
      ];
      service['usersSubject'].next(allUsers);

      service.getActiveUsers().subscribe((activeUsers) => {
        expect(activeUsers.length).toBe(0);
      });
    });
  });
});
