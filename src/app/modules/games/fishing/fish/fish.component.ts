import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
  sequence,
} from '@angular/animations';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
} from '@angular/core';
import { ReplaySubject, Subject, takeUntil, Observable } from 'rxjs';
import { NgIf } from '@angular/common';

/**
 * Fish animation states.
 */
type FishState = 'void' | 'entering' | 'waiting' | 'caught' | 'escaped';

/**
 * Adds a random wiggle to the fish.
 *
 * @param wiggleAmplification Represents the wiggle amplification.
 *
 * @returns A string.
 */
function randomWiggle(wiggleAmplification: number): string {
  const wiggleX = Math.random() * wiggleAmplification - wiggleAmplification / 2;
  const wiggleY = Math.random() * wiggleAmplification - wiggleAmplification / 2;
  return `translate(${wiggleX}px, ${wiggleY}px)`;
}

/**
 * Fish animation repeat method.
 *
 * @param count Represents the count.
 *
 * @returns An array of animations for the fish.
 */
function animationRepeat(count = 100): any[] {
  const animationArr = [];
  for (let i = 0; i < count; i++) {
    animationArr.push(
      animate('1s 0.1s ease-in-out', style({ transform: randomWiggle(10) }))
    );
  }
  return animationArr;
}

/**
 * This component is used to display a fish.
 */
@Component({
  selector: 'app-modules-games-fish',
  templateUrl: './fish.component.html',
  styleUrls: ['./fish.component.scss'],
  animations: [
    trigger('fishState', [
      state('void', style({ opacity: 0 })),
      state('entering', style({ opacity: 1 })),
      state('waiting', style({ opacity: 1 })),
      state('caught', style({ opacity: 0 })),
      state('escaped', style({ opacity: 0 })),
      transition('void <=> *', animate(100)),
      transition(
        'waiting <=> caught',
        animate(
          '0.3s 0.1s ease-in-out',
          style({ transform: 'translate(0, -100px)' })
        )
      ),
      transition(
        'waiting <=> escaped',
        animate(
          '0.3s 0.1s ease-in-out',
          style({ transform: 'translate(200px, 20px)' })
        )
      ),
      transition('* <=> waiting', sequence(animationRepeat())),
    ]),
  ],
  standalone: true,
  imports: [NgIf],
})
export class AppGamesFishComponent implements OnInit, OnDestroy, AfterViewInit {
  // The subjects used to controls the service communication.
  private onAnimationDone = new Subject<FishState>();
  private onAnimationDone_void = new Subject<FishState>();
  private onAnimationDone_entering = new Subject<FishState>();
  private onAnimationDone_waiting = new Subject<FishState>();
  private onAnimationDone_caught = new Subject<FishState>();
  private onAnimationDone_escaped = new Subject<FishState>();
  onAnimationEventEndedSubject = new Subject<AnimationEvent>();
  // Stores the fish state.
  fishState: FishState = 'entering';
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  @Input() fishImage = '';

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    // Listen for the animation events.
    this.onAnimationDone.pipe(takeUntil(this.destroyed)).subscribe((state) => {
      if (state === 'entering') {
        this.fishState = 'waiting';
      }
    });

    // Listen for the animation events when the animation is finished.
    this.onAnimationEventEndedSubject
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((event) => {
        const state: FishState = event.toState as FishState;
        switch (state) {
          case 'void':
            this.onAnimationDone.next(state);
            this.onAnimationDone_void.next(state);
            break;
          case 'entering':
            this.onAnimationDone.next(state);
            this.onAnimationDone_entering.next(state);
            break;
          case 'waiting':
            this.onAnimationDone.next(state);
            this.onAnimationDone_waiting.next(state);
            break;
          case 'caught':
            this.onAnimationDone.next(state);
            this.onAnimationDone_caught.next(state);
            break;
          case 'escaped':
            this.onAnimationDone.next(state);
            this.onAnimationDone_escaped.next(state);
            break;
          default:
            break;
        }
      });
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   */
  ngAfterViewInit(): void {
    this.addFish(this.fishImage);
  }

  /**
   * Unsubscribe Observables and detach event handlers to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  /**
   * Adds the fish on animation load.
   *
   * @param image Represents the fish image.
   *
   * @returns An observable as FishState.
   */
  addFish(image: string): Observable<FishState> {
    this.fishState = 'entering';
    this.fishImage = image;
    return this.onAnimationDone_entering
      .asObservable()
      .pipe(takeUntil(this.destroyed));
  }

  /**
   * Changes the animation state for the escaped fish.
   *
   * @returns An observable as FishState.
   */
  escaped(): Observable<FishState> {
    this.fishState = 'escaped';
    return this.onAnimationDone_escaped
      .asObservable()
      .pipe(takeUntil(this.destroyed));
  }

  /**
   * Changes the animation state for the caught fish.
   *
   * @returns An observable as FishState.
   */
  caught(): Observable<FishState> {
    this.fishState = 'caught';
    return this.onAnimationDone_caught
      .asObservable()
      .pipe(takeUntil(this.destroyed));
  }

  /**
   * Calls the source of the observable and cascades the action.
   *
   * @param event Represents the animation event.
   */
  onAnimationEventEnded(event: AnimationEvent): void {
    this.onAnimationEventEndedSubject.next(event);
  }
}
