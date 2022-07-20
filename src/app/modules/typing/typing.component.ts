import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { KEYS } from 'src/app/common/theme';
import { Courses } from 'src/app/courses';
import { CourseDTO } from 'src/app/dto/course.dto';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';

enum Color {
  Color1 = 1,
  Color2 = 2,
  Color3 = 3,
  Color4 = 4,
  Color5 = 5
}

// colorsMap[x][y] == Color
const colorsMap: { [key: string]: { [key: string]: Color } } = {
  '1': {
    // 1 2 11 12 13
    '1': Color.Color1, '2': Color.Color1, '11': Color.Color1, '12': Color.Color1, '13': Color.Color1,
    // 3 10
    '3': Color.Color2, '10': Color.Color2,
    // 4 9
    '4': Color.Color3, '9': Color.Color3,
    // 5 6
    '5': Color.Color4, '6': Color.Color4,
    // 7 8
    '7': Color.Color5, '8': Color.Color5,
  },
  '2': {
    // 2 11 12 13
    '2': Color.Color1, '11': Color.Color1, '12': Color.Color1, '13': Color.Color1,
    // 3 10
    '3': Color.Color2, '10': Color.Color2,
    // 4 9
    '4': Color.Color3, '9': Color.Color3,
    // 5 6
    '5': Color.Color4, '6': Color.Color4,
    // 7 8
    '7': Color.Color5, '8': Color.Color5,
  },
  '3': {
    // 2 11 12 13
    '2': Color.Color1, '11': Color.Color1, '12': Color.Color1, '13': Color.Color1,
    // 3 10
    '3': Color.Color2, '10': Color.Color2,
    // 4 9
    '4': Color.Color3, '9': Color.Color3,
    // 5 6
    '5': Color.Color4, '6': Color.Color4,
    // 7 8
    '7': Color.Color5, '8': Color.Color5,
  },
  '4': {
    // 3 12
    '3': Color.Color1, '12': Color.Color1,
    // 4 11
    '4': Color.Color2, '11': Color.Color2,
    // 5 10
    '5': Color.Color3, '10': Color.Color3,
    // 6 7
    '6': Color.Color4, '7': Color.Color4,
    // 8 9
    '8': Color.Color5, '9': Color.Color5,
  },
};

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
export class AppTypingComponent implements OnInit, AfterViewInit {
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
  keys = KEYS;

  testLetters: Array<{ val: string; color: Color; }> = [];

  @ViewChild('vkeyboard') vkeyboard: VKeyboardComponent | undefined;

  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.getAllCategories();

    fromEvent(document, 'keydown').subscribe((event) => {
      console.log('event', event);
    });
  }

  ngAfterViewInit(): void {
    console.log('this.exerciseElem.nativeElement', this.exerciseElem.nativeElement);
    if (this.exerciseElem.nativeElement && this.exercisesArr.length > 0) {
      // this.toHTML();
    }
  }

  /**
   * Get all categories for the current language.
   */
  getAllCategories(): void {
    if (this.currentLanguage in Courses) {
      const cat = Courses[this.currentLanguage];
      if (cat && cat.categories) {
        this.selectedCourse = cat.categories[cat.categories.length - 1].courses[0];
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
          const findKey = this.keys.find(el => el.key === letter.toLowerCase());
          if (findKey) {
            keyClass = findKey.color.toString();
          }
          letterElement.classList.add('theme-' + keyClass);
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

  setTheme(theme: '' | 'color-group' | 'sinle-color-group') {
    if (this.vkeyboard) {
      this.vkeyboard.setTheme(theme);
    }
  }

  setMode(mode: 'full' | 'partial' | 'minimal') {
    if (this.vkeyboard) {
      this.vkeyboard.setMode(mode);
    }
  }

  setNumbers(hasNumbers = true) {
    if (this.vkeyboard) {
      this.vkeyboard.setNumbers(hasNumbers);
    }
  }
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
      const keyDefinition = this.vkeyboard.getKeyDefinition(event.key);
      if (keyDefinition) {
        const parts = keyDefinition.key.split('-');
        console.log(keyDefinition, parts);
        if (colorsMap[parts[0]] && colorsMap[parts[0]][parts[1]]) {
          this.testLetters.push({ val: keyDefinition.value, color: colorsMap[parts[0]][parts[1]] });
        }
      }
    }
  }
}
