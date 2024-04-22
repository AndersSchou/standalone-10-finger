import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppGamesFishingWordFishComponent } from './word-fish.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppGamesFishingWordFishComponent', () => {
  let component: AppGamesFishingWordFishComponent;
  let fixture: ComponentFixture<AppGamesFishingWordFishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppGamesFishingWordFishComponent, BrowserAnimationsModule],
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamesFishingWordFishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
