import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppTypingHeaderViewComponent } from './header-view.component';

describe('AppTypingHeaderViewComponent', () => {
  let component: AppTypingHeaderViewComponent;
  let fixture: ComponentFixture<AppTypingHeaderViewComponent>;
  let routerServiceSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerServiceSpy = jasmine.createSpyObj<Router>(['navigate']);

    await TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerServiceSpy }],
      imports: [
        TranslateModule.forRoot(),
        MatIconTestingModule,
        AppTypingHeaderViewComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTypingHeaderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
