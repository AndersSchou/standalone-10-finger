import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppGamesFishInstructionsComponent } from './instructions.component';

describe('AppGamesFishInstructionsComponent', () => {
  let component: AppGamesFishInstructionsComponent;
  let fixture: ComponentFixture<AppGamesFishInstructionsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>(['navigate']);

    await TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        BrowserAnimationsModule,
        AppGamesFishInstructionsComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamesFishInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
