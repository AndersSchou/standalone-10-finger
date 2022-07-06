import { AppLoginComponent } from './login.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';

describe('AppLoginComponent', () => {
  let component: AppLoginComponent;
  let fixture: ComponentFixture<AppLoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>(['login']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
      ],
      imports: [],
      declarations: [AppLoginComponent],
      schemas: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(AppLoginComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    component.login();
    expect(authServiceSpy.login).toHaveBeenCalled();
  });
});
