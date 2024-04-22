import { AppSharedSettingsThemeComponent } from './theme.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';

describe('AppSharedSettingsThemeComponent', () => {
  let component: AppSharedSettingsThemeComponent;
  let fixture: ComponentFixture<AppSharedSettingsThemeComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'setThemeSetting',
      'getDefaultMainThemeColor',
    ]);

    await TestBed.configureTestingModule({
      providers: [{ provide: SettingsService, useValue: settingsServiceSpy }],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppSharedSettingsThemeComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSharedSettingsThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
