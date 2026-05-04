import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppGamesFishingSchoolFishComponent } from './school-fish.component';
import { GridService } from 'src/app/services/grid.service';
import { LevelService } from 'src/app/services/level.service';

describe('AppGamesFishingSchoolFishComponent', () => {
  let component: AppGamesFishingSchoolFishComponent;
  let fixture: ComponentFixture<AppGamesFishingSchoolFishComponent>;
  let gridServiceSpy: jasmine.SpyObj<GridService>;
  let levelServiceSpy: jasmine.SpyObj<LevelService>;

  beforeEach(async () => {
    gridServiceSpy = jasmine.createSpyObj<GridService>(['getGrid']);
    levelServiceSpy = jasmine.createSpyObj<LevelService>(['shuffle']);

    await TestBed.configureTestingModule({
      imports: [AppGamesFishingSchoolFishComponent],
      declarations: [],
      providers: [
        { provide: GridService, useValue: gridServiceSpy },
        { provide: LevelService, useValue: levelServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamesFishingSchoolFishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isPaused).toBeFalse();
    expect(component.isGameOver).toBeFalse();
    expect(component.playSound).toBeFalse();
    expect(component.maxFishInSchool).toBe(0);
    expect(component.allAvailableFishes).toEqual([]);
    expect(component.availableFishes).toEqual([]);
    expect(component.activeFish).toBeUndefined();
    expect(component.score).toBe(0);
    expect(component.completedFishes).toBe(0);
    expect(component.goal).toBe(0);
    expect(component.currentLevel).toBeUndefined();
    expect(component.fishCountToShow).toBe(1);
    expect(component.correctChars).toBe(0);
    expect(component.errors).toBe(0);
  });
});
