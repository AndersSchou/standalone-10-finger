import { MaterialModule } from './../../material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from 'src/app/services/settings.service';
import { AppSharedSettingsTextComponent } from './text.component';

describe('AppSharedSettingsTextComponent', () => {
  let component: AppSharedSettingsTextComponent;
  let fixture: ComponentFixture<AppSharedSettingsTextComponent>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    settingsServiceSpy = jasmine.createSpyObj<SettingsService>([
      'setTextSetting'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppSharedSettingsTextComponent],
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
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
    fixture = TestBed.createComponent(AppSharedSettingsTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
