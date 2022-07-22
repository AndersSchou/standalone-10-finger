import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, ReplaySubject, takeUntil } from 'rxjs';
import { colorsMap } from 'src/app/common/constants';
import { Color, STORAGE_KEY_TYPE } from 'src/app/common/enums';
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LAYOUT_GROUP_TYPE } from 'src/app/common/types';
import { Courses } from 'src/app/courses';
import { CourseDTO } from 'src/app/dto/course.dto';
import { SettingsService } from 'src/app/services/settings.service';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';


interface LetterDTO {
  index: number;
  letter: string;
}
interface ExerciseTextDTO {
  index: number;
  text: string[];
}

interface ExerciseDTO {
  name: string;
  index: number;
  lines: ExerciseTextDTO[];
}

/**
 * This component holds the logic for typing page.
 */
@Component({
  selector: 'app-modules-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss']
})
export class AppTypingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('exerciseElem') exerciseElem: ElementRef<HTMLElement> = {} as ElementRef;
  // Stores the selected course;
  selectedCourse: CourseDTO = {
    name: '',
    exercises: []
  };
  // Stores the current language.
  currentLanguage = 'da';
  // Stores the DOM element.
  divElement = document.createElement('div');
  exercisesArr: ExerciseDTO[] = [];

  viewSettings: boolean = false;

  @ViewChild('vkeyboard') vkeyboard: VKeyboardComponent | undefined;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<never>();

  constructor(
    private readonly router: Router,
    private readonly settingsService: SettingsService,
    private readonly cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => { this.viewSettings = viewSettings; });

    this.settingsService.keyboardThemeColorAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((themeColor: KEYBOARD_COLOR_GROUP_TYPE) => {
        this.setTheme(themeColor);
      });

    this.settingsService.keyboardPrimaryModeAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((mode: KEYBOARD_LAYOUT_GROUP_TYPE) => {
        this.setMode(mode);
      });

    this.getAllCategories();

    fromEvent(document, 'keydown').subscribe((event) => {
      console.log('event', event);
    });
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR)) {
      this.setTheme(localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR) as KEYBOARD_COLOR_GROUP_TYPE);
    } else {
      this.setTheme('');
    }

    if (localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT)) {
      console.log('1');
      this.setMode(localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT) as KEYBOARD_LAYOUT_GROUP_TYPE);
    } else {
      console.log('2');
      this.setMode('full');
    }
    this.cdr.detectChanges();

    console.log('this.exerciseElem.nativeElement', this.exerciseElem.nativeElement);
    if (this.exerciseElem.nativeElement && this.exercisesArr.length > 0) {
      // this.toHTML();
    }
  }

  ngOnDestroy(): void {
    console.log('destroy');
    // this.destroyed.next(true);
  }

  /**
   * Get all categories for the current language.
   */
  getAllCategories(): void {
    if (this.currentLanguage in Courses) {
      const cat = Courses[this.currentLanguage];
      if (cat && cat.categories) {
        this.selectedCourse = cat.categories[0].courses[0];
        // this.selectedCourse = cat.categories[cat.categories.length - 1].courses[0];
        console.log('this.selectedCourse', this.selectedCourse);
        // this.mapText();
        this.mapExercises();
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/set-course']);
  }

  resetCourse(): void { }

  mapExercises(): void {
    this.exercisesArr = [];
    for (let i = 0; i < this.selectedCourse.exercises.length; i++) {
      const exercise: ExerciseDTO = {
        name: this.selectedCourse.exercises[i].name,
        index: i,
        lines: []
      }
      exercise.lines = this.mapExerciseText(this.selectedCourse.exercises[i].text);
      this.exercisesArr.push(exercise);
    }
    console.log('exercisesArr', this.exercisesArr);

  }

  mapExerciseText(text: string): ExerciseTextDTO[] {
    const lines = text.split('\n');
    const linesArr: ExerciseTextDTO[] = [];
    for (let i = 0; i < lines.length; i++) {
      const currentLine: ExerciseTextDTO = {
        index: i,
        text: lines[i].split('')
      };
      linesArr.push(currentLine);
    }
    return linesArr;
  }


  toHTML(): void {
    console.log('this.exerciseElem.nativeElement', this.exerciseElem.nativeElement);
    for (const elem of this.exercisesArr) {
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('exercise-' + elem.index);

      for (const line of elem.lines) {
        const mainHldDiv = document.createElement('div');
        mainHldDiv.classList.add('exercise-hld');

        const lineElement = document.createElement('div');
        const className = ['line', 'line-' + line.index];
        lineElement.classList.add(...className);
        for (const letter of line.text) {
          const letterElement = document.createElement('span');
          let keyClass = 'none';
          const findKey = this.getKeyColor(letter);
          if (findKey) {
            keyClass = 'color' + findKey;
          }
          const keyDefaultClass = ['key-hld', 'current-pos', keyClass];
          letterElement.classList.add(...keyDefaultClass);
          letterElement.innerText = letter;
          lineElement.appendChild(letterElement);
        }

        // Add icon element to the line.
        const iconElem = document.createElement('div');
        iconElem.classList.add('icon-hld');
        // Add the line to the main div.
        mainHldDiv.appendChild(iconElem);
        mainHldDiv.appendChild(lineElement);
        mainDiv.appendChild(mainHldDiv);
      }
      const underlineDiv = document.createElement('div');
      const dividerClass = ['divider', 'mtb-18'];
      underlineDiv.classList.add(...dividerClass);
      this.divElement.appendChild(mainDiv);
      this.divElement.appendChild(underlineDiv);
    }
    this.exerciseElem.nativeElement.appendChild(this.divElement);
    console.log('---', this.divElement);
  }

  setTheme(theme: KEYBOARD_COLOR_GROUP_TYPE) {
    console.log('theme', theme);
    if (this.vkeyboard) {
      this.vkeyboard.setTheme(theme);
    }
  }

  setMode(mode: KEYBOARD_LAYOUT_GROUP_TYPE) {
    if (this.vkeyboard) {
      this.vkeyboard.setMode(mode);
    }
  }

  // setNumbers(hasNumbers = true) {
  //   if (this.vkeyboard) {
  //     this.vkeyboard.setNumbers(hasNumbers);
  //   }
  // }

  setLanguage(lan: 'dk' | 'sw' | 'no' | 'ro') {
    if (this.vkeyboard) {
      this.vkeyboard.setLanguage(lan);
    }
  }

  // Debug: delete
  @HostListener('window:keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    if (this.vkeyboard) {
      this.vkeyboard.highlightKey(event.key);
    }
  }

  /**
   * Get the character color based on its position on the keyboard.
   *
   * @param key Represents the character.
   *
   * @returns Returns the color of the character or undefined, if there is no custom color.
   */
  getKeyColor(key: string): Color | undefined {
    if (this.vkeyboard) {
      const keyDefinition = this.vkeyboard.getKeyDefinition(key);
      if (keyDefinition) {
        const parts = keyDefinition.key.split('-');
        if (colorsMap[parts[0]] && colorsMap[parts[0]][parts[1]]) {
          return colorsMap[parts[0]][parts[1]];
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}
