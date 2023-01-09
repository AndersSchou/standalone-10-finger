import { Observable, defer, timer, map, of, concat, catchError, filter, switchMap, EMPTY, Subject } from "rxjs";

// From: https://stackoverflow.com/questions/67989122/rxjs-pause-timer-observable

/**
 * Usecase:
 *
 * const watch = getStopWatch();
 * watch.display.subscribe(); // Numbers emitted here every interval once started by control.
 * watch.control.next("START");
 * watch.control.next("STOP");
 * watch.control.next("RESET");
 * // Completing the control cleans up everything.
 * watch.control.complete();
 */

/**
 * Get the stopwatch.
 *
 * @param interval Represents the interval in milliseconds.
 *
 * @returns An object with a control and display property.
 */
export function getStopWatch(interval: number = 1000): {
  control: Subject<string>,
  display: Observable<number>
} {
  const control = new Subject<string>();
  return {
    control,
    display: createStopwatch(control, interval)
  }
}

/**
 * Creates a stopwatch.
 *
 * @param control Represents the control observable.
 * @param interval Represents the interval in milliseconds.
 *
 * @returns An observable that emits numbers every interval.
 */
export function createStopwatch(control: Observable<string>, interval = 1000): Observable<number> {
  return defer(() => {
    let toggle: boolean = false;
    let count: number = 0;

    const ticker = timer(0, interval).pipe(
      map(x => count++)
    );
    const end = of("END");

    return concat(
      control,
      end
    ).pipe(
      catchError(_ => end),
      filter(control =>
        control === "START" ||
        control === "STOP" ||
        control === "RESET" ||
        control === "END"
      ),
      switchMap(control => {
        if (control === "START" && !toggle) {
          toggle = true;
          return ticker;
        } else if (control === "STOP" && toggle) {
          toggle = false;
          return EMPTY;
        } else if (control === "RESET") {
          count = 0;
          if (toggle) {
            return ticker;
          }
        }
        return EMPTY;
      })
    );
  });
}
