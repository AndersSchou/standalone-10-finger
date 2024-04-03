import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { AppSharedSettingsReadComponent } from './read.component';

describe('AppSharedSettingsReadComponent', () => {
  let component: AppSharedSettingsReadComponent;
  let fixture: ComponentFixture<AppSharedSettingsReadComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'setTextSetting',
      'getDefaultReadLetter',
      'getDefaultReadText',
    ]);

    await TestBed.configureTestingModule({
      providers: [{ provide: SettingsService, useValue: settingsServiceSpy }],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppSharedSettingsReadComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSharedSettingsReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
