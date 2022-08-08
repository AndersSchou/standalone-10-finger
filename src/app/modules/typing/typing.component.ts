import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { colorsMap, DefaultReadLetterOptions, DefaultReadTextOptions, REGEX_FOR_LETTERS_WITH_DIACRITICS_AND_NBR, REGEX_WITH_DIACRITICS, SENTENCE_REGEX } from 'src/app/common/constants';
import { Color, STORAGE_KEY_TYPE, TEXT_SETTINGS_TYPE } from 'src/app/common/enums';
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LANGUAGE, KEYBOARD_LAYOUT_GROUP_TYPE, TextSettings } from 'src/app/common/types';
import { Courses } from 'src/app/courses';
import { CategoriesDTO, CourseDTO, CourseExerciseDTO, CourseResponseDTO } from 'src/app/dto/course.dto';
import { KeyboardSettingsDTO } from 'src/app/dto/settings.dto';
import { ReadOptionsDTO } from 'src/app/dto/speak.dto';
import { TranslationsDTO } from 'src/app/dto/translation.dto';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SpeechService } from 'src/app/services/speech.service';
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
  completed?: boolean;
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
    exercises: [],
    results: []
  };
  categories: CourseResponseDTO = {} as CourseResponseDTO;
  currentCategory: CategoriesDTO = {} as CategoriesDTO;
  // Stores the current language.
  currentLanguage = 'da';
  // Stores the DOM element.
  divElement = document.createElement('div');
  exercisesArr: ExerciseDTO[] = [];

  viewSettings: boolean = false;

  textSetting: { [key: string]: string } = {};
  coloredText: string = '';
  keyboardTop = false;
  // Stores the index of the current/active exercise.
  exerciseIndex = 0;
  // Stores the index of the current/active line.
  currentLineIndex = 0;
  // Stores the index of the current/active letter.
  currentLetterIndex = 0;
  // Stores the current character that will be typed.
  currentChar = '';
  // Stores the number of mistakes on keypress.
  nbrOfMistakes = 0;
  // Stores the current Element.
  currentActiveElement?: Element;
  lineLength = 0;
  exerciseLength = 0;
  currentProgress = 0;
  @ViewChild('vkeyboard') vkeyboard: VKeyboardComponent | undefined;
  // Stores the timer subscription.
  timerSubscription: Subscription = Subscription.EMPTY;
  // Stores the number of seconds since the start of the exercise.
  timeCounter = 0;
  readTextOptions: ReadOptionsDTO = { readLetterName: false, readLetterSound: false, readWord: false, readSentence: false };
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<never>();

  constructor(
    private readonly router: Router,
    private readonly settingsService: SettingsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly languageHelperService: LanguageHelperService,
    private readonly speechService: SpeechService,
  ) {
    this.setInitialTextSettings();
  }

  setInitialTextSettings(): void {
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE)) {
      this.textSetting = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_SIZE) as string);
    }
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR)) {
      this.coloredText = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_COLOR) as string);
    }
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT)) {
      const option = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT) as string);
      if (option === 'top') {
        this.keyboardTop = true;
      } else {
        this.keyboardTop = false;
      }
    }
    // Set read letter option.
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.READ_LETTER)) {
      const readOption = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.READ_LETTER) as string);
      if (readOption.type !== 'none') {
        const selectedOption: { type: 'readLetterName' | 'readLetterSound' } = readOption;
        this.readTextOptions[selectedOption.type] = true;
      }
    }

    // Set read text options.
    if (localStorage.getItem(TEXT_SETTINGS_TYPE.READ_TEXT)) {
      const readText = JSON.parse(localStorage.getItem(TEXT_SETTINGS_TYPE.READ_TEXT) as string);
      for (const opt of readText) {
        if (opt.selected) {
          const selectedOption: { type: 'readWord' | 'readSentence' } = opt;
          this.readTextOptions[selectedOption.type] = true;
        }
      }
    }

  }

  ngOnInit(): void {
    // Listens for any changes regarding the settings view (show/hide).
    this.settingsService.viewSettingsAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((viewSettings: boolean) => { this.viewSettings = viewSettings; });

    // Listens for any changes regarding the keyboard theme color.
    this.settingsService.keyboardThemeColorAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((themeColor: KEYBOARD_COLOR_GROUP_TYPE) => {
        this.setTheme(themeColor);
      });

    // Listens for any changes regarding the keyboard primary layout.
    this.settingsService.keyboardPrimaryModeAction
      .pipe(takeUntil(this.destroyed))
      .subscribe((mode: KEYBOARD_LAYOUT_GROUP_TYPE) => {
        this.setMode(mode);
      });

    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged.pipe(
      takeUntil(this.destroyed)
    ).subscribe((trans: TranslationsDTO) => {
      this.currentLanguage = this.languageHelperService.currentLangUsed;
      this.setLanguage(this.currentLanguage.split('-')[0]);
    });

    // Listens for any changes regarding the text settings.
    this.textSettingsChanges();


    // Listens for keydown events.
    this.keyDownListener();

    this.getCourseProgress();
  }

  getCourseProgress(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      const coursesProgress = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      this.categories = coursesProgress;
      const findLatestCategory = coursesProgress.categories.reduce((prev: CategoriesDTO, current: CategoriesDTO) => {
        if (current.updatedAt) {
          if (!prev || !prev.updatedAt) {
            return current;
          }
          if (new Date(current.updatedAt) > new Date(prev.updatedAt)) {
            return current;
          }
        }
        return prev;
      });

      this.currentCategory = findLatestCategory;
      console.log('this.currentCategory', this.currentCategory);
      const findLatestCourse = findLatestCategory.courses.reduce((prev: CourseDTO, current: CourseDTO) => {
        if (current.updatedAt) {
          if (!prev || !prev.updatedAt) {
            return current;
          }
          if (new Date(current.updatedAt) > new Date(prev.updatedAt)) {
            return current;
          }
        }
        return prev;
      });
      this.selectedCourse = findLatestCourse;
      this.selectedCourse.results = this.selectedCourse.results ? this.selectedCourse.results : [];
      const findLastExercise = this.selectedCourse.exercises.reduce((prev: CourseExerciseDTO, current: CourseExerciseDTO) => {
        if (current.updatedAt) {
          if (!prev || !prev.updatedAt) {
            return current;
          }
          if (new Date(current.updatedAt) > new Date(prev.updatedAt)) {
            return current;
          }
        }
        return prev;
      });
      console.log('findLastExercise', findLastExercise);
      const findIndex = this.selectedCourse.exercises.findIndex(el => el.name === findLastExercise.name);
      if (!findLastExercise.completed) {
        this.exerciseIndex = findIndex;
      } else {
        if (findIndex && findIndex + 1 <= this.selectedCourse.exercises.length - 1) {
          this.exerciseIndex = findIndex + 1;
        }
      }
      this.calculateProgress();
      this.mapExercises();
    } else {
      this.getAllCategories();
    }
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR)) {
      this.setTheme(localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_THEME_COLOR) as KEYBOARD_COLOR_GROUP_TYPE);
    } else {
      this.setTheme('');
    }

    if (localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT)) {
      this.setMode(localStorage.getItem(STORAGE_KEY_TYPE.KEYBOARD_PRIMARY_LAYOUT) as KEYBOARD_LAYOUT_GROUP_TYPE);
    } else {
      this.setMode('full');
    }
    this.cdr.detectChanges();

    if (this.exerciseElem.nativeElement && this.exercisesArr.length > 0) {
      this.toHTML();
      this.currentPosition();
    }
  }

  ngOnDestroy(): void {
    console.log('destroy');
    if (this.divElement && this.divElement.hasChildNodes()) {
      this.exerciseElem.nativeElement.removeChild(this.divElement);
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    // this.destroyed.next(true);
  }

  calculateProgress(): void {
    const completedExercises = this.selectedCourse.exercises.filter((exercise: CourseExerciseDTO) => exercise.completed);
    let index = completedExercises.length > 0 ? completedExercises.length : 0;
    this.currentProgress = (100 * index) / this.selectedCourse.exercises.length;
  }

  /**
   * Listens for any changes regarding the text settings.
   */
  textSettingsChanges(): void {
    this.settingsService.textSettingsAction.subscribe((textSettings: TextSettings) => {
      if (textSettings.type === TEXT_SETTINGS_TYPE.TEXT_SIZE) {
        // Set the font size.
        this.textSetting['fontSize'] = textSettings.value + 'px';
      } else if (textSettings.type === TEXT_SETTINGS_TYPE.TEXT_FAMILY) {
        // Set the font family.
        this.textSetting['fontFamily'] = textSettings.value;
      } else if (textSettings.type === TEXT_SETTINGS_TYPE.TEXT_COLOR) {
        // Set the background color of the text.
        this.coloredText = textSettings.value;
      } else if (textSettings.type === TEXT_SETTINGS_TYPE.TEXT_DISPLAY_LAYOUT) {
        // Set the layout display.
        if (textSettings.value === 'top') {
          this.keyboardTop = true;
        } else {
          this.keyboardTop = false;
        }
      } else if (textSettings.type === TEXT_SETTINGS_TYPE.READ_LETTER) {
        if (textSettings.value !== 'none') {
          if (textSettings.value === 'readLetterName') {
            this.readTextOptions['readLetterName'] = true;
            this.readTextOptions['readLetterSound'] = false;
          } else {
            this.readTextOptions['readLetterName'] = false;
            this.readTextOptions['readLetterSound'] = true;
          }
        } else {
          this.readTextOptions['readLetterName'] = false;
          this.readTextOptions['readLetterSound'] = false;
        }
      } else if (textSettings.type === TEXT_SETTINGS_TYPE.READ_TEXT) {
        const val: 'readWord' | 'readSentence' = textSettings.value as 'readWord' | 'readSentence';
        this.readTextOptions[val] = !this.readTextOptions[val];
      }
      this.cdr.detectChanges();
    });
  }

  keyDownListener(): void {
    fromEvent(document, 'keydown').subscribe((event) => {
      // console.log('event', event);
      console.log('this.currentChar', this.currentChar);
      const text = this.exercisesArr[this.exerciseIndex].lines[this.currentLineIndex].text.slice(0, this.currentLetterIndex + 1);
      console.log('text', text);
      console.log('aaa', this.exercisesArr[this.exerciseIndex], this.currentLineIndex, this.currentLetterIndex);
      // if (this.vkeyboard) {
      //   // Highlight key on keydown.
      //   this.vkeyboard.highlightKey((event as KeyboardEvent).key);
      // }

      console.log('this.readTextOptions', this.readTextOptions);
      this.speechService.handleReading((event as KeyboardEvent).key, this.readTextOptions, 'mv_da_acl');
      if (this.currentChar === (event as KeyboardEvent).key) {
        let isSpace = false;
        if ((event as KeyboardEvent).key === ' ') {
          isSpace = true;
          // Prevent auto scroll on space.
          event.preventDefault();
        }
        this.markAsCompleted(isSpace);
        if (this.currentLetterIndex < this.lineLength - 1) {
          this.currentLetterIndex++;
          this.currentPosition();
        } else {
          if (this.currentLineIndex < this.exercisesArr[this.exerciseIndex].lines.length - 1) {
            this.currentLineIndex++;
            this.currentLetterIndex = 0;
            this.currentPosition();
          } else {
            this.currentLetterIndex = 0;
            this.currentLineIndex = 0;

            const findIncompleteExercise = this.exercisesArr.find(exercise => exercise.index > this.exerciseIndex && !exercise.completed);
            if (findIncompleteExercise) {
              this.exerciseIndex = findIncompleteExercise.index;
              this.currentPosition();
              // Update the curse progress when the user completes an exercise.
              this.updateProgress(this.exerciseIndex - 1);
            } else {
              const findPrevIncompleteExercise = this.exercisesArr.find(exercise => !exercise.completed);
              if (findPrevIncompleteExercise) {
                this.exerciseIndex = findPrevIncompleteExercise.index;
                this.currentPosition();
                // Update the curse progress when the user completes an exercise.
                this.updateProgress(this.exerciseIndex - 1);
              } else {
                if (this.exerciseIndex === this.exercisesArr.length - 1) {
                  // Update the curse progress when the user completes an exercise.
                  this.updateProgress(this.exerciseIndex, true, true);
                  // Show achievement screen.
                  this.router.navigate(['/set-course']);
                }
              }
            }
            console.log('findIncompleteExercise', findIncompleteExercise);
            // if (this.exerciseIndex < this.exercisesArr.length - 1) {
            //   this.exerciseIndex++;
            //   this.currentPosition();
            //   // Update the curse progress when the user completes an exercise.
            //   this.updateProgress(this.exerciseIndex - 1);
            // } else {
            //   console.log('finished');
            //   // Update the curse progress when the user completes an exercise.
            //   this.updateProgress(this.exerciseIndex, true, true);
            //   // Show achievement screen.
            //   this.router.navigate(['/set-course']);
            // }
          }
        }
        if (this.timerSubscription === Subscription.EMPTY) {
          this.timerSubscription = timer(0, 1000).subscribe(() => {
            this.timeCounter++;
          });
        }
      } else {
        if ((event as KeyboardEvent).key !== 'Shift') {
          this.markAsMistake();
        }
      }
    });
  }

  /**
   * Get all categories for the current language.
   */
  getAllCategories(): void {
    if (this.currentLanguage in Courses) {
      const cat = Courses[this.currentLanguage];
      if (cat && cat.categories) {
        console.log('cat', cat);
        cat.categories[0].updatedAt = new Date();
        cat.categories[0].courses[0].updatedAt = new Date();
        this.currentCategory = cat.categories[0];
        this.categories = cat;
        localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify(this.categories));
        // this.selectedCourse = cat.categories[cat.categories.length - 2].courses[cat.categories[cat.categories.length - 2].courses.length - 3];
        // this.selectedCourse = cat.categories[cat.categories.length - 2].courses[cat.categories[cat.categories.length - 2].courses.length - 1];
        this.selectedCourse = cat.categories[0].courses[0];
        this.selectedCourse.results = [];
        // this.selectedCourse = cat.categories[cat.categories.length - 1].courses[0];
        console.log('this.selectedCourse', this.selectedCourse);
        // this.mapText();
        this.mapExercises();
      }
    }
  }

  /**
   * Display the current position of the selected character.
   */
  currentPosition(): void {
    const currentExercise = this.exercisesArr[this.exerciseIndex];
    const currentLine = currentExercise.lines[this.currentLineIndex];
    this.lineLength = currentLine.text.length;
    this.currentChar = currentLine.text[this.currentLetterIndex];

    console.log('currentPosition', this.exerciseIndex, this.currentLineIndex, this.currentLetterIndex);
    this.showCurrentKeyComb(this.currentChar);
    const findHtmlElement = document.getElementsByClassName('exercise-' + this.exerciseIndex)[0];
    console.log('findHtmlElement', findHtmlElement);
    if (findHtmlElement) {
      const findLineEl = findHtmlElement.getElementsByClassName('line-' + this.currentLineIndex)[0];
      console.log('findLineEl', findLineEl);
      if (findLineEl) {
        const findSpanEl = findLineEl.getElementsByClassName('key-hld ' + this.currentLetterIndex)[0];
        console.log('findSpanEl', findSpanEl);
        if (findSpanEl) {
          findSpanEl.classList.add('active');
          this.currentActiveElement = findSpanEl;
          // Scroll to the center of the exercise view.
          this.currentActiveElement.scrollIntoView({ behavior: 'smooth', block: "center", inline: "nearest" });
        }
      }
    }
  }

  /**
   * Highlight the current key combination.
   *
   * @param char Represents the current character.
   */
  showCurrentKeyComb(char: string): void {
    if (this.vkeyboard) {
      // console.log(this.vkeyboard.getKeyDefinition(char));
      this.vkeyboard.highlightKey(char);
      this.cdr.detectChanges();
    }
  }

  /**
   * Mark the current character as completed.
   *
   * @param isSpace Tells if the current character is a space or not.
   */
  markAsCompleted(isSpace: boolean): void {
    if (this.currentActiveElement) {
      this.currentActiveElement.classList.remove('active');
      if (!isSpace) {
        // Add completed class (used to change the background for the completed character) to the current character (all chars except space).
        this.currentActiveElement.classList.add('completed');
      }
    }
  }

  /**
   * Mark the current character as mistake and count the number of mistakes.
   */
  markAsMistake(): void {
    console.log('markAsMistake', this.currentActiveElement);
    this.nbrOfMistakes++;
    if (this.currentActiveElement) {
      this.currentActiveElement.classList.add('error');
    }
    console.log('this.nbrOfMistakes', this.nbrOfMistakes);
  }

  goBack(): void {
    this.router.navigate(['/set-course']);
  }

  resetCourse(): void {
    console.log('this.selectedCourse', this.selectedCourse);
    this.exerciseIndex = 0;
    this.currentLineIndex = 0;
    this.currentLetterIndex = 0;
    this.nbrOfMistakes = 0;
    this.currentProgress = 0;
    this.selectedCourse.results = [];
    console.log('this.currentProgress', this.currentProgress);
    if (this.timerSubscription !== Subscription.EMPTY) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = Subscription.EMPTY;
    }
    this.timeCounter = 0;
    // Remove all completed, error and active classes from the HTML elements.
    this.resetKeysClasses();
    // Reset the course progress.
    this.resetCourseProgress();
    // Update visuals for the current exercise.
    this.currentPosition();
  }

  /**
   * Reset the course progress.
   */
  resetCourseProgress(): void {
    this.selectedCourse.updatedAt = new Date();
    this.selectedCourse.exercises = this.selectedCourse.exercises.map(el => {
      const exercise = {
        name: el.name,
        text: el.text
      };
      return exercise;
    });
    this.saveCourseProgress();
  }

  /**
   * Reset the keys classes (Remove all completed, error and active classes from the HTML elements).
   */
  resetKeysClasses(): void {
    if (this.currentActiveElement) {
      this.currentActiveElement.classList.remove('active');
    }
    const findAllCompletedElements = Array.from(document.getElementsByClassName('completed'));
    findAllCompletedElements.forEach((element) => { element.classList.remove('completed'); });
    const findAllElementsWithError = Array.from(document.getElementsByClassName('error'));
    findAllElementsWithError.forEach((element) => { element.classList.remove('error'); });
  }

  /**
   * Save the course progress in the localStorage and update the progress bar.
   *
   * @param isFinished Tells if the course is finished or not.
   */
  saveCourseProgress(isFinished = false): void {
    console.log('---asjdh', this.selectedCourse, this.exerciseIndex, this.selectedCourse.exercises.length);
    if (isFinished) {
      let charsNbr = 0;
      for (const exercise of this.selectedCourse.exercises) {
        charsNbr += exercise.text.length;
      }
      this.selectedCourse.results.push({
        mistakes: this.nbrOfMistakes,
        time: this.timeCounter,
        characters: charsNbr,
        updatedAt: new Date()
      });
    }
    const findCat = this.categories.categories.find(el => el.name === this.currentCategory.name);
    if (findCat) {
      findCat.updatedAt = new Date();
      localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify(this.categories));
    }
    if (!isFinished) {
      // this.currentProgress = (100 * this.exerciseIndex) / this.selectedCourse.exercises.length;
      this.calculateProgress();
    }
  }

  /**
   * Update exercise progress.
   *
   * @param exerciseIndex Represents the current exercise index.
   * @param isCompleted Tells if the current exercise is completed or not.
   * @param isFinished Tells if the current course is finished or not.
   */
  updateProgress(exerciseIndex: number, isCompleted = false, isFinished = false): void {
    console.log('this.course', this.selectedCourse);
    this.selectedCourse.updatedAt = new Date();
    if (isCompleted) {
      this.selectedCourse.completed = true;
    }
    this.selectedCourse.exercises[exerciseIndex].completed = true;
    this.selectedCourse.exercises[exerciseIndex].updatedAt = new Date();
    this.saveCourseProgress(isFinished);
  }

  /**
   * Map each exercise to an array.
   */
  mapExercises(): void {
    this.exercisesArr = [];
    console.log('this.selectedCourse.exercises', this.selectedCourse.exercises);
    for (let i = 0; i < this.selectedCourse.exercises.length; i++) {
      const exercise: ExerciseDTO = {
        name: this.selectedCourse.exercises[i].name,
        index: i,
        lines: [],
        completed: this.selectedCourse.exercises[i].completed ? this.selectedCourse.exercises[i].completed : false,
      }
      exercise.lines = this.mapExerciseText(this.selectedCourse.exercises[i].text);
      this.exercisesArr.push(exercise);
    }

  }

  /**
   * Split the exercise text into an array of lines.
   *
   * @param text Represents the current exercise text.
   *
   * @returns An array of ExerciseTextDTO for each character in the text.
   */
  mapExerciseText(text: string): ExerciseTextDTO[] {
    let lines: string[] | undefined = [text];
    if (REGEX_FOR_LETTERS_WITH_DIACRITICS_AND_NBR.test(text)) {
      lines = text.match(SENTENCE_REGEX)?.filter(line => line !== '');
    }
    const linesArr: ExerciseTextDTO[] = [];
    if (lines && lines.length > 0) {
      for (let i = 0; i < lines.length; i++) {
        const currentLine: ExerciseTextDTO = {
          index: i,
          text: lines[i].split('')
        };
        linesArr.push(currentLine);
      }
    }
    return linesArr;
  }

  /**
   * Create the HTML elements based on the current course.
   */
  toHTML(): void {
    // console.log('this.exerciseElem.nativeElement', this.exerciseElem.nativeElement);
    console.log('this.exercisesArr', this.exercisesArr);
    for (const elem of this.exercisesArr) {
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('exercise-' + elem.index);

      for (const line of elem.lines) {
        const mainHldDiv = document.createElement('div');
        mainHldDiv.classList.add('exercise-hld');

        const lineElement = document.createElement('div');
        const className = ['line', 'line-' + line.index];
        lineElement.classList.add(...className);
        let groupLetterElement;

        for (let i = 0; i < line.text.length; i++) {
          const letterElement = document.createElement('span');
          let keyClass = 'none';
          const findKey = this.getKeyColor(line.text[i]);
          if (findKey) {
            keyClass = 'color' + findKey;
          }
          const completedClass = (elem.completed && line.text[i] !== ' ') ? 'completed' : 'none';
          const keyDefaultClass = ['key-hld', i.toString(), keyClass, completedClass];
          letterElement.classList.add(...keyDefaultClass);
          letterElement.innerText = line.text[i];
          if (groupLetterElement && !line.text[i].match(REGEX_WITH_DIACRITICS)) {
            // Group letters of a word in a single span element (used for not breaking the words into new lines).
            groupLetterElement.appendChild(letterElement);
            lineElement.appendChild(groupLetterElement);
          } else {
            lineElement.appendChild(letterElement);
          }

          if (line.text[i].match(REGEX_WITH_DIACRITICS)) {
            groupLetterElement = document.createElement('div');
            groupLetterElement.classList.add('group-letter');
          }
        }

        // Add icon element to the line.
        const iconElem = document.createElement('div');
        const iconClassName = ['icon-hld', 'exercise-' + elem.index, line.index.toString()];
        iconElem.classList.add(...iconClassName);
        // Add the line to the main div.
        mainHldDiv.appendChild(iconElem);
        // Add on click event to each icon.
        this.onClick(iconElem, elem);
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

  /**
   * Set the keyboard color theme.
   *
   * @param theme Represents the selected theme.
   */
  setTheme(theme: KEYBOARD_COLOR_GROUP_TYPE) {
    if (this.vkeyboard) {
      this.vkeyboard.setTheme(theme);
    }
  }

  /**
   * Set the display mode of the keyboard.
   *
   * @param mode Represents the selected mode.
   */
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

  /**
   * Set the language of the keyboard.
   *
   * @param lan Represents the selected language.
   */
  setLanguage(lan: string) {
    if (this.vkeyboard) {
      this.vkeyboard.setLanguage(lan as KEYBOARD_LANGUAGE);
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

  /**
   * Click event handler for the icon element (starts play sentence on click).
   *
   * @param element Represents the icon element.
   * @param elemInfo Represents the exercise info.
   */
  onClick(element: HTMLElement, elemInfo: any): void {
    fromEvent(element, 'click')
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        const textToRead = elemInfo.lines[element.classList[element.classList.length - 1]].text.join('');
        this.speechService.play(textToRead, 'mv_da_acl');
      });
  }
}
