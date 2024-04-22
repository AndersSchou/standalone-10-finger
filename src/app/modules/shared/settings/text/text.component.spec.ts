import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { AppSharedSettingsTextComponent } from './text.component';

describe('AppSharedSettingsTextComponent', () => {
  let component: AppSharedSettingsTextComponent;
  let fixture: ComponentFixture<AppSharedSettingsTextComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'setTextSetting',
      'getDefaultTextSize',
      'getDefaultTextColor',
    ]);

    await TestBed.configureTestingModule({
      providers: [{ provide: SettingsService, useValue: settingsServiceSpy }],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppSharedSettingsTextComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSharedSettingsTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
