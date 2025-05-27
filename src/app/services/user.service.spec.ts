import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      address: {
        street: 'Test Street',
        suite: 'Suite 1',
        city: 'Test City',
        zipcode: '12345',
        geo: { lat: '0', lng: '0' }
      },
      phone: '123-456-7890',
      website: 'test.com',
      company: {
        name: 'Test Company',
        catchPhrase: 'Test Phrase',
        bs: 'test bs'
      }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
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

  it('should fetch users', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch user by id', () => {
    const userId = 1;
    const mockUser = mockUsers[0];

    service.getUserById(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});