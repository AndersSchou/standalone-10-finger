import { Observable, Subject } from 'rxjs';

// Words Per Second.
export class WPSService {

  private correctLettersPerSecond = 1;
  private wrongLettersPerSecond = 1;

  private correctWordsPerSecond = 1;
  private wrongWordsPerSecond = 1;

  private correctLettersPerSecondSubscription: Subject<number> = new Subject<number>();
  get onCorrectLettersPerSecond(): Observable<number> {
    return this.correctLettersPerSecondSubscription.asObservable();
  }

  private wrongLettersPerSecondSubscription: Subject<number> = new Subject<number>();
  get onWrongLettersPerSecond(): Observable<number> {
    return this.wrongLettersPerSecondSubscription.asObservable();
  }

  private correctWordsPerSecondSubscription: Subject<number> = new Subject<number>();
  get onCorrectWordsPerSecond(): Observable<number> {
    return this.correctWordsPerSecondSubscription.asObservable();
  }

  private wrongWordsPerSecondSubscription: Subject<number> = new Subject<number>();
  get onWrongWordsPerSecond(): Observable<number> {
    return this.wrongWordsPerSecondSubscription.asObservable();
  }

  /**
   * Update the time when a correct letter was typed.
   *
   * @param msToWriteOneLetter Represents the time it took to write one letter.
   */
  updateCLPS(msToWriteOneLetter: number): void {
    if (msToWriteOneLetter > 50) {
      // console.log('---msToWriteOneLetter', msToWriteOneLetter);
      // The value counts only as 10% of the total.

      this.correctLettersPerSecond = this.correctLettersPerSecond * 0.9 + 1000 / msToWriteOneLetter * 0.1;
      this.correctLettersPerSecondSubscription.next(this.correctLettersPerSecond);
    }
  }

  /**
   * Update the time when a wrong letter was typed.
   *
   * @param msToWriteOneLetter Represents the time it took to write one letter.
   */
  updateWLPS(msToWriteOneLetter: number): void {
    if (msToWriteOneLetter > 50) {
      console.log('---updateWLPS', msToWriteOneLetter);
      // The value counts only as 10% of the total.

      this.wrongLettersPerSecond = this.wrongLettersPerSecond * 0.9 + 1000 / msToWriteOneLetter * 0.1;
      this.wrongLettersPerSecondSubscription.next(this.wrongLettersPerSecond);
    }
  }

  /**
   * Update the time when a correct word was typed.
   *
   * @param msToWriteOneWord Represents the time it took to write one word.
   */
  updateCWPS(msToWriteOneWord: number): void {
    if (msToWriteOneWord > 50) {
      console.log('---updateCWPS', msToWriteOneWord);
      // The value counts only as 10% of the total.

      this.correctWordsPerSecond = this.correctWordsPerSecond * 0.9 + 1000 / msToWriteOneWord * 0.1;
      this.correctWordsPerSecondSubscription.next(this.correctWordsPerSecond);
    }
  }

  /**
   * Update the time when a word was mistyped.
   *
   * @param msToWriteOneWord Represents the time it took to write one word.
   */
  updateWWPS(msToWriteOneWord: number): void {
    if (msToWriteOneWord > 50) {
      // console.log('---updateWWPS', msToWriteOneWord);
      // The value counts only as 10% of the total.

      this.wrongWordsPerSecond = this.wrongWordsPerSecond * 0.9 + 1000 / msToWriteOneWord * 0.1;
      this.wrongWordsPerSecondSubscription.next(this.wrongWordsPerSecond);
    }
  }

  /**
   * Calculate time difference in milliseconds.
   *
   * @param start Represents the time when the user started typing.
   * @param end Represents the time when the user stopped typing.
   *
   * @returns The time difference in milliseconds.
   */
  calculateTimeDiff(start: Date, end: Date): number {
    return end.getTime() - start.getTime();
  }

}
