import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

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

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    mockUserService.getUsers.and.returnValue(of(mockUsers));
    
    component.ngOnInit();
    
    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading users', () => {
    const errorMessage = 'Error loading users';
    mockUserService.getUsers.and.returnValue(throwError(() => errorMessage));
    
    component.ngOnInit();
    
    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should navigate to user details', () => {
    const userId = 1;
    
    component.viewUser(userId);
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user', userId]);
  });
});