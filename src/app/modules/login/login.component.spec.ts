import { AppLoginComponent } from './login.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

describe('AppLoginComponent', () => {
  let component: AppLoginComponent;
  let fixture: ComponentFixture<AppLoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>(['login']);

    matDialogSpy = jasmine.createSpyObj<MatDialog>(['open']);
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);

    await TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
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
