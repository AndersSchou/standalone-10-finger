import { MaterialModule } from './../../material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppSharedSettingsLogoutComponent } from './logout.component';
import { AuthService } from 'src/app/services/auth.service';

describe('AppSharedSettingsLogoutComponent', () => {
  let component: AppSharedSettingsLogoutComponent;
  let fixture: ComponentFixture<AppSharedSettingsLogoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>([
      'logout',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppSharedSettingsLogoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MaterialModule,
        MatIconTestingModule,
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSharedSettingsLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
