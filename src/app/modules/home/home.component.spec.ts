import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { MaterialModule } from '../shared/material.module';
import { AppHomeComponent } from './home.component';

describe('AppHomeComponent', () => {
  let component: AppHomeComponent;
  let fixture: ComponentFixture<AppHomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    settingsServiceSpy = jasmine.createSpyObj<SettingsService>(['viewSettingsAction']);
    (settingsServiceSpy as any).viewSettingsAction = new Observable(
      (subscriber) => {
        onViewSettingsActionSpy = subscriber;
      }
    );

    await TestBed.configureTestingModule({
      declarations: [AppHomeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SettingsService, useValue: settingsServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot(),
        MaterialModule,
        MatIconTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
