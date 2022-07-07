import { MaterialModule } from './../material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppSharedTopMenuComponent } from './top-menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppSharedTopMenuComponent', () => {
  let component: AppSharedTopMenuComponent;
  let fixture: ComponentFixture<AppSharedTopMenuComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AppSharedTopMenuComponent],
      providers: [],
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
    fixture = TestBed.createComponent(AppSharedTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
