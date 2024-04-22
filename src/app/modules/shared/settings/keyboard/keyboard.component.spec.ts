import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { AppSharedSettingsKeyboardComponent } from './keyboard.component';

describe('AppSharedSettingsKeyboardComponent', () => {
  let component: AppSharedSettingsKeyboardComponent;
  let fixture: ComponentFixture<AppSharedSettingsKeyboardComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'setKeyboardThemeColor',
      'setKeyboardPrimaryMode',
      'getDefaultKeyboardThemeColor',
      'getDefaultKeyboardPrimaryLayout',
      'getDefaultTextDisplayLayout',
    ]);

    await TestBed.configureTestingModule({
      providers: [{ provide: SettingsService, useValue: settingsServiceSpy }],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppSharedSettingsKeyboardComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSharedSettingsKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
