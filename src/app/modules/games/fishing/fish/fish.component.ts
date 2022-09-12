import { trigger, state, style, transition, animate, AnimationEvent, sequence } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

type FishState = 'void' | 'entering' | 'waiting' | 'caught' | 'escaped';

function randomWiggle(wiggleAmplification: number): string {
  const wiggleX = Math.random() * wiggleAmplification - wiggleAmplification / 2;
  const wiggleY = Math.random() * wiggleAmplification - wiggleAmplification / 2;
  return `translate(${wiggleX}px, ${wiggleY}px)`;
}

function animationRepeat(count = 100): any[] {
  const animationArr = [];
  for (let i = 0; i < count; i++) {
    animationArr.push(animate('1s 0.1s ease-in-out', style({ transform: randomWiggle(10) })));
  }
  return animationArr;
}

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
      transition('waiting <=> caught', animate('0.5s 0.1s ease-in-out', style({ transform: 'translate(0, -100px)' }))),
      transition('waiting <=> escaped', animate('0.5s 0.1s ease-in-out', style({ transform: 'translate(200px, 20px)' }))),
      transition('* <=> waiting', sequence(animationRepeat())),
    ])
  ],
})
export class AppGamesFishComponent implements OnInit, OnDestroy {

  fishImage = '';

  private onAnimationDone = new Subject<FishState>();
  private onAnimationDone_void = new Subject<FishState>();
  private onAnimationDone_entering = new Subject<FishState>();
  private onAnimationDone_waiting = new Subject<FishState>();
  private onAnimationDone_caught = new Subject<FishState>();
  private onAnimationDone_escaped = new Subject<FishState>();
  onAnimationEventEndedSubject = new Subject<AnimationEvent>();

  fishState: FishState = 'void';
  // Stores the subscribers until they're destroyed.
  private readonly destroyed = new ReplaySubject<boolean>();

  constructor() { }

  ngOnInit(): void {
    this.onAnimationDone
      .pipe(takeUntil(this.destroyed))
      .subscribe((state) => {
        if (state === 'entering') {
          this.fishState = 'waiting';
        }
      });

    this.onAnimationEventEndedSubject.asObservable().pipe(takeUntil(this.destroyed)).subscribe(event => {
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
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  addFish(image: string) {
    this.fishState = 'entering';
    this.fishImage = image;
    return this.onAnimationDone_entering.asObservable().pipe(takeUntil(this.destroyed));
  }

  escaped() {
    this.fishState = 'escaped';
    return this.onAnimationDone_escaped.asObservable().pipe(takeUntil(this.destroyed));
  }

  caught() {
    this.fishState = 'caught';
    return this.onAnimationDone_caught.asObservable().pipe(takeUntil(this.destroyed));
  }

  onAnimationEventEnded(event: AnimationEvent) {
    this.onAnimationEventEndedSubject.next(event);
  }


}
