import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
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
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    mockUserService.getUserById.and.returnValue(of(mockUser));
    
    component.ngOnInit();
    
    expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading user', () => {
    const errorMessage = 'Error loading user';
    mockUserService.getUserById.and.returnValue(throwError(() => errorMessage));
    
    component.ngOnInit();
    
    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should navigate back', () => {
    component.goBack();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});