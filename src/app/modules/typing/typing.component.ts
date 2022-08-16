import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, ReplaySubject, Subscription, takeUntil, timer } from 'rxjs';
import { colorsMap, REGEX_FOR_LETTERS_WITH_DIACRITICS_AND_NBR, REGEX_WITH_DIACRITICS, SENTENCE_REGEX } from 'src/app/common/constants';
import { Color, STORAGE_KEY_TYPE, TEXT_SETTINGS_TYPE } from 'src/app/common/enums';
import { KEYBOARD_COLOR_GROUP_TYPE, KEYBOARD_LANGUAGE, KEYBOARD_LAYOUT_GROUP_TYPE, TextSettings } from 'src/app/common/types';
import { Courses } from 'src/app/courses';
import { CategoriesDTO, CourseDTO, CourseExerciseDTO, CourseResponseDTO, StoredCourseResponseDTO } from 'src/app/dto/course.dto';
import { ReadOptionsDTO } from 'src/app/dto/speak.dto';
import { TranslationsDTO } from 'src/app/dto/translation.dto';
import { CourseHelperService } from 'src/app/services/course-helper.service';
import { LanguageHelperService } from 'src/app/services/language.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SpeechService } from 'src/app/services/speech.service';
import { VKeyboardComponent } from 'src/app/vkeyboard/vkeyboard.component';

/**
 * Exercise text interface.
 */
interface ExerciseTextDTO {
  index: number;
  text: string[];
}

/**
 * Exercise interface.
 */
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
  @ViewChild('vkeyboard') vkeyboard: VKeyboardComponent | undefined;
  // Stores the selected course;
  selectedCourse: CourseDTO = {
    name: '',
    exercises: [],
    results: []
  };
  // Stores the categories object.
  categories: CourseResponseDTO = {} as CourseResponseDTO;
  // Stores the current(active) category.
  currentCategory: CategoriesDTO = {} as CategoriesDTO;
  // Stores the current language.
  currentLanguage: string = '';
  // Stores the DOM element.
  divElement: any;
  // Stores the exercises array with all the needed data for creating/updating the HTML elements.
  exercisesArr: ExerciseDTO[] = [];
  // Tells if it should show the settings view or not.
  viewSettings: boolean = false;
  // Stores the text settings (font size and font family).
  textSetting: { [key: string]: string } = {};
  // Stores the text color option for the exercise.
  coloredText: string = '';
  // Tells if the keyboard should be displayed on top or on the bottom of the exercises holder.
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
  // Stores the current line length.
  lineLength = 0;
  // Stores the current course progress.
  currentProgress = 0;
  // Stores the start time (used to calculate the time spent on an exercise).
  startTime: Date = new Date();
  // Tells if it should start the timer or not.
  startCount = false;
  // Stores the read options.
  readTextOptions: ReadOptionsDTO = { readLetterName: false, readLetterSound: false, readWord: false, readSentence: false };
  // Tells if it should resume course or not.
  resumeCourse: boolean = false;
  // Stores the data from the local storage.
  storedData: StoredCourseResponseDTO[] = [];
  // Reading subscription.
  readingSubscription: Subscription = Subscription.EMPTY;
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  /**
   *
   * @param router Reference to Router.
   * @param settingsService Reference to SettingsService.
   * @param cdr Reference to ChangeDetectorRef.
   * @param languageHelperService Reference to LanguageHelperService.
   * @param speechService Reference to SpeechService.
   * @param activatedRoute Reference to ActivatedRoute.
   * @param courseHelperService Reference to CourseHelperService.
   */
  constructor(
    private readonly router: Router,
    private readonly settingsService: SettingsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly languageHelperService: LanguageHelperService,
    private readonly speechService: SpeechService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly courseHelperService: CourseHelperService,
  ) {
    this.setInitialTextSettings();

    this.currentLanguage = this.languageHelperService.currentLangUsed;
    this.setLanguage();
  }

  /**
   * Set initial settings based on the stored settings from local storage.
   */
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

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    // Checks queryParams for resume param.
    this.activatedRoute.queryParams.subscribe(params => {
      const shouldResume = 'resume';
      if (params && params[shouldResume]) {
        this.resumeCourse = true;
      }
    });

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

    if (this.currentLanguage && this.currentLanguage.length > 0) {
      this.courseProgress();
    }

    // Listens for any changes regarding the current used language.
    this.languageHelperService.OnLanguageChanged.pipe(
      takeUntil(this.destroyed)
    ).subscribe((trans: TranslationsDTO) => {
      this.currentLanguage = this.languageHelperService.currentLangUsed;
      this.setLanguage();
      this.courseProgress();
    });

    // Listens for any changes regarding the text settings.
    this.textSettingsChanges();

    // Listens for keydown events.
    this.keyDownListener();
  }


  /**
   *  A lifecycle hook that is called after Angular has fully initialized a component's view.
   */
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

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    // Cleanup the DOM.
    if (this.divElement && this.divElement.hasChildNodes()) {
      this.exerciseElem.nativeElement.removeChild(this.divElement);
    }
    this.destroyed.next(true);
  }

  /**
   * Get course progress.
   */
  courseProgress(): void {
    if (localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS)) {
      this.storedData = JSON.parse(localStorage.getItem(STORAGE_KEY_TYPE.COURSES_PROGRESS) as string);
      const findData = this.storedData.find((el: StoredCourseResponseDTO) => el.language === this.currentLanguage.split('-')[0]);
      if (findData) {
        this.categories = findData.data;

        this.setCurrentCategory();
        this.setCurrentCourse();
        this.setCurrentExercise();

        this.calculateProgress();
        this.mapExercises();
      } else {
        this.getAllCategories();
      }
    } else {
      this.getAllCategories();
    }
  }

  /**
   * Set current category.
   */
  setCurrentCategory(): void {
    const findLatestCategory = this.courseHelperService.getLatestCategory(this.categories);

    if (!this.resumeCourse) {
      this.currentCategory = findLatestCategory;
    } else {
      // Resume course. Check if the latest category is completed.
      if (findLatestCategory.completed) {
        // If it's completed, find the next category.
        const findNextCat = this.categories.categories.find((cat: CategoriesDTO) => !cat.completed);
        if (findNextCat) {
          this.currentCategory = findNextCat;
        } else {
          // If all categories are completed, then start from the beginning.
          this.currentCategory = this.categories.categories[0];
        }
      } else {
        this.currentCategory = findLatestCategory;
      }
    }
  }

  /**
   * Set current course.
   */
  setCurrentCourse(): void {
    const findLatestCourse = this.courseHelperService.getLatestCourse(this.currentCategory);

    if (!this.resumeCourse) {
      this.selectedCourse = findLatestCourse;
    } else {
      // Resume course. Check if the latest category is completed.
      if (findLatestCourse.completed) {
        // If it's completed, find the next category.
        const findNextCourse = this.currentCategory.courses.find(course => !course.completed);
        if (findNextCourse) {
          this.selectedCourse = findNextCourse;
        } else {
          // If all categories are completed, then start from the beginning.
          this.selectedCourse = this.currentCategory.courses[0];
        }
      } else {
        this.selectedCourse = findLatestCourse;
      }
    }

    this.selectedCourse.results = this.selectedCourse.results ? this.selectedCourse.results : [];
    this.selectedCourse.exercises = this.selectedCourse.exercises.map(el => {
      const elem = el;
      elem.results = el.results ? el.results : [];
      return elem;
    });
  }

  /**
   * Set current exercise.
   */
  setCurrentExercise(): void {
    const findLastExercise = this.courseHelperService.getLatestExercise(this.selectedCourse);

    const findIndex = this.selectedCourse.exercises.findIndex(el => el.name === findLastExercise.name);
    if (!this.resumeCourse) {
      this.exerciseIndex = findIndex;
    } else {
      if (!findLastExercise.completed) {
        this.exerciseIndex = findIndex;
      } else {
        if (findIndex && findIndex + 1 <= this.selectedCourse.exercises.length - 1) {
          this.exerciseIndex = findIndex + 1;
        }
      }
    }
    this.selectedCourse.exercises = this.selectedCourse.exercises.map((el, index) => {
      const elem = el;
      elem.results = el.results ? el.results : [];
      if (index >= this.exerciseIndex) {
        elem.completed = false;
      }
      return elem;
    });
  }

  /**
   * Calculate course progress based on completed exercises.
   */
  calculateProgress(): void {
    const completedExercises = this.selectedCourse.exercises.filter((exercise: CourseExerciseDTO) => exercise.completed);
    let index = completedExercises.length > 0 ? completedExercises.length : 0;
    this.currentProgress = (100 * index) / this.selectedCourse.exercises.length;
  }

  /**
   * Listens for any changes regarding the text settings.
   */
  textSettingsChanges(): void {
    this.settingsService.textSettingsAction
      .pipe(takeUntil(this.destroyed)).subscribe((textSettings: TextSettings) => {
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
          // Set read letter/sound option.
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
          // Set read word/sentence options.
          const val: 'readWord' | 'readSentence' = textSettings.value as 'readWord' | 'readSentence';
          this.readTextOptions[val] = !this.readTextOptions[val];
        }
        this.cdr.detectChanges();
      });
  }

  /**
   * Keydown event listener.
   */
  keyDownListener(): void {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroyed)).subscribe((event) => {

        if (this.readingSubscription) {
          this.readingSubscription.unsubscribe();
        }

        this.readingSubscription = timer(100).subscribe(() => {
          // Handle reading on keydown (read letter/sound/word/sentence).
          this.speechService.handleReading((event as KeyboardEvent).key, this.readTextOptions, 'mv_da_acl');
        });

        if (this.currentChar === (event as KeyboardEvent).key) {
          let isSpace = false;
          if ((event as KeyboardEvent).key === ' ') {
            isSpace = true;
            // Prevent auto scroll on space.
            event.preventDefault();
          }
          this.markAsCompleted(isSpace);
          if (!this.startCount) {
            this.startTime = new Date();
            this.startCount = true;
          }
          // Update the current letter index.
          this.updateCurrentPosition();
        } else {
          if ((event as KeyboardEvent).key !== 'Shift') {
            this.markAsMistake();
          }
        }
      });
  }

  /**
   * Update the letter/line/exercise index based on the current position.
   */
  updateCurrentPosition(): void {
    if (this.currentLetterIndex < this.lineLength - 1) {
      this.currentLetterIndex++;
      this.currentPosition();
    } else {
      // Update the current line index.
      if (this.currentLineIndex < this.exercisesArr[this.exerciseIndex].lines.length - 1) {
        this.currentLineIndex++;
        this.currentLetterIndex = 0;
        this.currentPosition();
      } else {
        // Update the current exercise index.
        this.currentLetterIndex = 0;
        this.currentLineIndex = 0;
        // Find next exercise.
        const findNextIncompleteExercise = this.exercisesArr.find(exercise => exercise.index > this.exerciseIndex && !exercise.completed);
        if (findNextIncompleteExercise) {
          this.exerciseIndex = findNextIncompleteExercise.index;
          this.currentPosition();
          // Update the course progress when the user completes an exercise.
          this.updateProgress(this.exerciseIndex - 1);
        } else {
          // Find previous exercise.
          const findPrevIncompleteExercise = this.exercisesArr.find(exercise => !exercise.completed);
          if (findPrevIncompleteExercise && findPrevIncompleteExercise.index !== this.exerciseIndex) {
            // Update the course progress when the user completes an exercise.
            this.updateProgress(this.exerciseIndex);
            this.exerciseIndex = findPrevIncompleteExercise.index;
            this.currentPosition();
          } else {
            // Update the course progress when the user completes all the exercises.
            this.updateProgress(this.exerciseIndex, true);
            // Show achievement screen.
            this.router.navigate(['/set-course']);
          }
        }
      }
    }
  }

  /**
   * Get all categories for the current language.
   */
  getAllCategories(): void {
    this.categories = {} as CourseResponseDTO;
    const courseLang = this.currentLanguage.split('-')[0];
    if (courseLang in Courses) {
      const cat = Courses[courseLang];
      if (cat && cat.categories) {
        cat.categories[0].updatedAt = new Date();
        cat.categories[0].courses[0].updatedAt = new Date();

        this.categories = cat;
        this.currentCategory = cat.categories[0];
        this.selectedCourse = this.currentCategory.courses[0];
        this.selectedCourse.results = [];
        this.selectedCourse.exercises = this.selectedCourse.exercises.map(el => {
          const elem = el;
          elem.results = [];
          return elem;
        });

        const storeData: StoredCourseResponseDTO = {
          language: courseLang, data: this.categories
        };
        this.storedData.push(storeData);
        localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify(this.storedData));
        this.mapExercises();
      } else {
        this.categories = {} as CourseResponseDTO;
        this.currentCategory = {} as CategoriesDTO;
        this.selectedCourse = {
          name: '',
          exercises: [],
          results: []
        };
        // Clean up the DOM.
        if (this.exerciseElem.nativeElement && this.divElement && this.divElement.hasChildNodes()) {
          this.divElement.remove();
        }
      }
    }
  }

  /**
   * Display the current position of the selected character.
   */
  currentPosition(): void {
    const currentLine = this.exercisesArr[this.exerciseIndex].lines[this.currentLineIndex];
    this.lineLength = currentLine.text.length;
    this.currentChar = currentLine.text[this.currentLetterIndex];

    this.showCurrentKeyComb(this.currentChar);
    const findHtmlElement = document.getElementsByClassName('exercise-' + this.exerciseIndex)[0];
    if (findHtmlElement) {
      const findLineEl = findHtmlElement.getElementsByClassName('line-' + this.currentLineIndex)[0];
      if (findLineEl) {
        const findSpanEl = findLineEl.getElementsByClassName('key-hld ' + this.currentLetterIndex)[0];
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
    if (this.currentActiveElement && this.currentActiveElement.classList.contains('active')) {
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
    this.nbrOfMistakes++;
    if (this.currentActiveElement && !this.currentActiveElement.classList.contains('error')) {
      this.currentActiveElement.classList.add('error');
    }
  }

  /**
   * Go back method.
   */
  goBack(): void {
    this.router.navigate(['/set-course']);
  }

  /**
   * Reset course method.
   */
  resetCourse(): void {
    this.exerciseIndex = 0;
    this.currentLineIndex = 0;
    this.currentLetterIndex = 0;
    this.nbrOfMistakes = 0;
    this.currentProgress = 0;
    this.selectedCourse.results = [];
    this.startCount = false;
    this.exercisesArr = this.exercisesArr.map(el => {
      const elem = el;
      elem.completed = false;
      return elem;
    });
    // Remove all completed, error and active classes from the HTML elements.
    this.resetKeysClasses();
    // Reset the course progress.
    this.resetCourseProgress();
    // Update visuals for the current exercise.
    this.currentPosition();
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
   * Reset the course progress.
   */
  resetCourseProgress(): void {
    this.selectedCourse.updatedAt = new Date();
    this.selectedCourse.exercises = this.selectedCourse.exercises.map(el => {
      const exercise = {
        name: el.name,
        text: el.text,
        results: [],
      };
      return exercise;
    });
    this.saveCourseProgress();
  }

  /**
   * Save the course progress in the localStorage and update the progress bar.
   *
   * @param isFinished Tells if the course is finished or not.
   */
  saveCourseProgress(isFinished = false): void {
    if (isFinished) {
      let charsNbr = 0;
      let totalMistakes = 0;
      let totalTime = 0;
      for (const exercise of this.selectedCourse.exercises) {
        charsNbr += exercise.text.length;
        totalMistakes += exercise.results[exercise.results.length - 1].mistakes;
        totalTime += exercise.results[exercise.results.length - 1].time;
      }
      this.selectedCourse.results.push({
        mistakes: totalMistakes,
        time: totalTime,
        characters: charsNbr,
        updatedAt: new Date()
      });
    }
    // Update course progress in local storage.
    const findItem = this.storedData.find(el => el.language === this.currentLanguage.split('-')[0]);
    if (findItem) {
      const findCat = findItem.data.categories.find(el => el.name === this.currentCategory.name);
      if (findCat) {
        findCat.updatedAt = new Date();
        if (isFinished) {
          const findIncompleteCourse = findCat.courses.find(el => !el.completed);
          if (!findIncompleteCourse) {
            findCat.completed = true;
          }
        }
        localStorage.setItem(STORAGE_KEY_TYPE.COURSES_PROGRESS, JSON.stringify(this.storedData));
      }
    }

    if (!isFinished) {
      this.calculateProgress();
    }
  }

  /**
   * Update exercise progress.
   *
   * @param exerciseIndex Represents the current exercise index.
   * @param isCompleted Tells if the current course is completed or not.
   */
  updateProgress(exerciseIndex: number, isCompleted = false): void {
    this.selectedCourse.updatedAt = new Date();
    if (isCompleted) {
      this.selectedCourse.completed = true;
    }
    this.selectedCourse.exercises[exerciseIndex].completed = true;
    this.selectedCourse.exercises[exerciseIndex].updatedAt = new Date();

    this.exercisesArr[exerciseIndex].completed = true;

    this.selectedCourse.exercises[exerciseIndex].results.push({
      mistakes: this.nbrOfMistakes,
      time: new Date().getTime() - new Date(this.startTime).getTime(),
      characters: this.selectedCourse.exercises[exerciseIndex].text.length,
      updatedAt: new Date()
    });
    // Reset the exercise progress when going to the next exercise.
    this.nbrOfMistakes = 0;
    this.startCount = false;
    this.saveCourseProgress(isCompleted);
  }

  /**
   * Map each exercise to an array.
   */
  mapExercises(): void {
    this.exercisesArr = [];
    if (this.selectedCourse && this.selectedCourse.exercises.length > 0) {
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
      if (this.exerciseElem.nativeElement) {
        this.toHTML();
        this.currentPosition();
      }
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
    this.exerciseElem.nativeElement.innerHTML = '';
    if (this.exercisesArr.length > 0) {
      this.divElement = document.createElement('div');
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
    }
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
   */
  setLanguage() {
    if (this.vkeyboard) {
      const lang = this.currentLanguage.split('-')[0];
      this.vkeyboard.setLanguage(lang as KEYBOARD_LANGUAGE);
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
