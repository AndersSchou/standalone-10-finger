import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { MaterialModule } from '../shared/material.module';
import { AppAchievementsComponent } from './achievements.component';

describe('AppAchievementsComponent', () => {
  let component: AppAchievementsComponent;
  let fixture: ComponentFixture<AppAchievementsComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let onViewSettingsActionSpy;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>(['viewSettingsAction']);
    (settingsServiceSpy as any).viewSettingsAction = new Observable(
      (subscriber) => {
        onViewSettingsActionSpy = subscriber;
      }
    );

    await TestBed.configureTestingModule({
      declarations: [AppAchievementsComponent],
      providers: [
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
    fixture = TestBed.createComponent(AppAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
