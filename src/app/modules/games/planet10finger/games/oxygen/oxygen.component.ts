import { Component, AfterViewInit, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { VKeyboardComponent } from "src/app/vkeyboard/vkeyboard.component";
import { AchievementService } from "../../services/achievement.service";
import { StatsService } from "../../services/stats.service";
import {
  FingerName,
  HandSide,
  isFingerExpectedForKey,
} from "../shared/finger-indicator.util";

interface OxygenSequence {
  keys?: string[];
  groups?: string[][];
}

interface OxygenTrainingSet {
  sequences: OxygenSequence[];
}

type KeyState = "pending" | "active" | "done" | "error";

@Component({
  selector: "app-planet10finger-oxygen",
  templateUrl: "./oxygen.component.html",
  styleUrl: "./oxygen.component.scss",
  standalone: true,
  imports: [CommonModule, VKeyboardComponent],
})
export class OxygenComponent implements AfterViewInit, OnDestroy {
  @ViewChild(VKeyboardComponent) vkeyboard?: VKeyboardComponent;
  @Input() coinsEarned = 0;
  @Input() difficulty: 1 | 2 | 3 = 2;
  @Output() gameClose = new EventEmitter<void>();
  @Input() trainingSetIndex = 0;

  trainingSets: OxygenTrainingSet[] = [];
  currentSequence: string[] = [];
  currentStep = 0;
  roundsCompleted = 0;
  trainingComplete = false;
  showError = false;
  wrongPressCount = 0;
  private usedSequencePairs: Set<number> = new Set();
  private currentSequenceData: OxygenSequence | null = null;
  private keydownListener: ((e: KeyboardEvent) => void) | null = null;
  // Level 3 tracking: 3 rows that are shuffled in random order
  private rowOrder: number[] = [0, 1, 2]; // Which row (0=QWER/UIOP, 1=ASDF/JKLÆ, 2=ZXCV/M,.-) to use
  private currentRowIndex: number = 0; // Which row in the shuffled order are we on (0, 1, or 2)
  private usedKeysRow0: Set<string> = new Set(); // QWER/UIOP
  private usedKeysRow1: Set<string> = new Set(); // ASDF/JKLÆ
  private usedKeysRow2: Set<string> = new Set(); // ZXCV/M,.-
  private currentSideIndex: number = 0; // 0 = left side (QWER, ASDF, ZXCV), 1 = right side (UIOP, JKLÆ, M,.-)
  // Tracking for merged pairs (seq 0&1, 2&3, 4&5)
  private usedKeysPair0Left: Set<string> = new Set(); // QWER
  private usedKeysPair0Right: Set<string> = new Set(); // UIOP
  private usedKeysPair1Left: Set<string> = new Set(); // ASDF
  private usedKeysPair1Right: Set<string> = new Set(); // JKLÆ
  private usedKeysPair2Left: Set<string> = new Set(); // ZXCV
  private usedKeysPair2Right: Set<string> = new Set(); // M,.-
  private lastPairIndex: number = -1; // Track which pair was just used (0, 1, or 2)

  constructor(
    private readonly http: HttpClient,
    private readonly achievementService: AchievementService,
    private readonly statsService: StatsService
  ) {
    this.startGame();
  }

  ngAfterViewInit(): void {
    this.vkeyboard?.setTheme("color-group");
    this.vkeyboard?.setMode("partial");
  }

  get totalSequences(): number {
    return this.trainingSets[this.trainingSetIndex]?.sequences.length ?? 6;
  }

  getKeyState(index: number): KeyState {
    if (this.showError && index === this.currentStep) return "error";
    if (index < this.currentStep) return "done";
    if (index === this.currentStep) return "active";
    return "pending";
  }

  getKeyStateInRow(seqIndex: number, keyIndex: number): KeyState {
    if (seqIndex < this.roundsCompleted) return "done";
    if (seqIndex > this.roundsCompleted) return "pending";
    return this.getKeyState(keyIndex);
  }

  isFingerExpected(hand: HandSide, finger: FingerName): boolean {
    const expected = this.currentSequence[this.currentStep];
    return isFingerExpectedForKey(expected, hand, finger);
  }

  close(): void {
    this.gameClose.emit();
  }

  private startGame(): void {
    this.roundsCompleted = 0;
    this.trainingComplete = false;
    this.wrongPressCount = 0;
    this.usedSequencePairs.clear();
    this.currentSequenceData = null;
    this.rowOrder = this.shuffleArray(["0", "1", "2"]).map(x => parseInt(x));
    this.currentRowIndex = 0;
    this.currentSideIndex = 0;
    this.usedKeysRow0.clear();
    this.usedKeysRow1.clear();
    this.usedKeysRow2.clear();
    this.usedKeysPair0Left.clear();
    this.usedKeysPair0Right.clear();
    this.usedKeysPair1Left.clear();
    this.usedKeysPair1Right.clear();
    this.usedKeysPair2Left.clear();
    this.usedKeysPair2Right.clear();
    this.lastPairIndex = -1;
    this.http
      .get<{ trainingSets: OxygenTrainingSet[] }>("assets/games/oxygen-sequences.json")
      .subscribe((data) => {
        this.trainingSets = data.trainingSets;
        this.loadRandomSequence();
        this.attachKeyListener();
      });
  }

  private getRandomUnusedGroupIndex(): number {
    if (!this.currentSequenceData?.groups) return -1;
    const totalGroups = this.currentSequenceData.groups.length;
    const availableIndices = Array.from({ length: totalGroups }, (_, i) => i);
    if (availableIndices.length === 0) {
      return -1;
    }
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  }

  private generateRandomSequenceFromGroups(): string[] {
    if (!this.currentSequenceData?.groups) return [];
    const groups = this.currentSequenceData.groups;
    const selectedKeys: string[] = [];
    const usedGroupIndices = new Set<number>();
    while (selectedKeys.length < 4 && usedGroupIndices.size < groups.length) {
      const availableGroupIndices = Array.from({ length: groups.length }, (_, i) => i)
        .filter(i => !usedGroupIndices.has(i));
      if (availableGroupIndices.length === 0) break;
      const groupIdx = availableGroupIndices[Math.floor(Math.random() * availableGroupIndices.length)];
      usedGroupIndices.add(groupIdx);
      const group = groups[groupIdx];
      const randomKeyIdx = Math.floor(Math.random() * group.length);
      selectedKeys.push(group[randomKeyIdx]);
    }
    return selectedKeys;
  }

  private shuffleArray(array: string[]): string[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateAlternatingSequenceFromPairs(): string[] {
    const baseSet = this.trainingSets[0];
    if (!baseSet || baseSet.sequences.length < 6) return [];

    // Define left and right sides for each row pair
    // Row 0: Left = QWER (seq 0), Right = UIOP (seq 1)
    // Row 1: Left = ASDF (seq 2), Right = JKLÆ (seq 3)
    // Row 2: Left = ZXCV (seq 4), Right = M,.- (seq 5)
    const leftSides = [
      baseSet.sequences[0]?.keys ?? [],  // QWER
      baseSet.sequences[2]?.keys ?? [],  // ASDF
      baseSet.sequences[4]?.keys ?? []   // ZXCV
    ];
    const rightSides = [
      baseSet.sequences[1]?.keys ?? [],  // UIOP
      baseSet.sequences[3]?.keys ?? [],  // JKLÆ
      baseSet.sequences[5]?.keys ?? []   // M,.-
    ];

    // Get the current row based on rowOrder
    const currentRowNum = this.rowOrder[this.currentRowIndex];
    
    // Select keys from the appropriate side
    const keysForSide = this.currentSideIndex === 0 ? leftSides[currentRowNum] : rightSides[currentRowNum];
    
    let usedKeysSet: Set<string>;
    if (currentRowNum === 0) {
      usedKeysSet = this.usedKeysRow0;
    } else if (currentRowNum === 1) {
      usedKeysSet = this.usedKeysRow1;
    } else {
      usedKeysSet = this.usedKeysRow2;
    }

    const result: string[] = [];

    // Pick 4 keys from the current side
    for (let i = 0; i < 4; i++) {
      let availableKeys = keysForSide.filter(k => !usedKeysSet.has(k));

      // If side is exhausted, reset tracking for this side
      if (availableKeys.length === 0) {
        usedKeysSet.clear();
        availableKeys = [...keysForSide];
      }

      // Pick a random key from available keys
      const idx = Math.floor(Math.random() * availableKeys.length);
      const selectedKey = availableKeys[idx];
      result.push(selectedKey);
      usedKeysSet.add(selectedKey);
      availableKeys.splice(idx, 1);
    }

    // Move to next row
    this.currentRowIndex = (this.currentRowIndex + 1) % 3;

    // After completing all 3 rows with current side, switch side
    if (this.currentRowIndex === 0) {
      this.currentSideIndex = (this.currentSideIndex + 1) % 2;
      // After switching back to left side (0), reshuffle row order
      if (this.currentSideIndex === 0) {
        this.rowOrder = this.shuffleArray(["0", "1", "2"]).map(x => parseInt(x));
      }
    }

    return result;
  }

  private generateMergedSequenceFromPair(seqIndex: number): string[] {
    const baseSet = this.trainingSets[0];
    if (!baseSet || baseSet.sequences.length < 6) return [];

    // Define pairs: [0,1] QWER/UIOP, [2,3] ASDF/JKLÆ, [4,5] ZXCV/M,.-
    let pairIndex = Math.floor(seqIndex / 2); // 0, 1, or 2
    let leftSeq = baseSet.sequences[pairIndex * 2];
    let rightSeq = baseSet.sequences[pairIndex * 2 + 1];
    
    if (!leftSeq?.keys || !rightSeq?.keys) return [];
    
    const leftKeys = leftSeq.keys;
    const rightKeys = rightSeq.keys;
    
    // Get tracking sets for this pair
    let usedLeftSet: Set<string>;
    let usedRightSet: Set<string>;
    
    if (pairIndex === 0) {
      usedLeftSet = this.usedKeysPair0Left;
      usedRightSet = this.usedKeysPair0Right;
    } else if (pairIndex === 1) {
      usedLeftSet = this.usedKeysPair1Left;
      usedRightSet = this.usedKeysPair1Right;
    } else {
      usedLeftSet = this.usedKeysPair2Left;
      usedRightSet = this.usedKeysPair2Right;
    }
    
    const result: string[] = [];
    
    // Alternate: left, right, left, right
    for (let i = 0; i < 4; i++) {
      const isLeftTurn = i % 2 === 0;
      const keysToUse = isLeftTurn ? leftKeys : rightKeys;
      const usedSet = isLeftTurn ? usedLeftSet : usedRightSet;
      
      let availableKeys = keysToUse.filter(k => !usedSet.has(k));
      
      // If side exhausted, reset it
      if (availableKeys.length === 0) {
        usedSet.clear();
        availableKeys = [...keysToUse];
      }
      
      // Pick random key from available
      const idx = Math.floor(Math.random() * availableKeys.length);
      const selectedKey = availableKeys[idx];
      result.push(selectedKey);
      usedSet.add(selectedKey);
    }
    
    return result;
  }

  private getRandomUnusedSequenceIndex(): number {
    const set = this.trainingSets[this.trainingSetIndex];
    const totalSequences = set?.sequences.length ?? 4;
    
    // For level 3 only: exclude the last pair that was used
    const lastPairSequences = this.trainingSetIndex === 2 && this.lastPairIndex >= 0
      ? [this.lastPairIndex * 2, this.lastPairIndex * 2 + 1]
      : [];
    
    const availableIndices = Array.from({ length: totalSequences }, (_, i) => i)
      .filter(i => !this.usedSequencePairs.has(i) && !lastPairSequences.includes(i));
    
    if (availableIndices.length === 0) {
      return -1;
    }
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  }

  private loadRandomSequence(): void {
    let baseSequenceIndex = this.getRandomUnusedSequenceIndex();
    if (baseSequenceIndex === -1) {
      return;
    }

    this.usedSequencePairs.add(baseSequenceIndex);
    // Track which pair was just used (0, 1, or 2) - only for level 3
    if (this.trainingSetIndex === 2) {
      this.lastPairIndex = Math.floor(baseSequenceIndex / 2);
    }
    
    const set = this.trainingSets[this.trainingSetIndex];
    const seq = set?.sequences[baseSequenceIndex];
    if (!seq) return;
    this.currentSequenceData = seq;
    this.currentStep = 0;
    this.showError = false;
    if (seq.groups && seq.groups.length > 0) {
      this.currentSequence = this.generateRandomSequenceFromGroups();
    } else {
      const baseSequence = seq.keys ?? [];
      // Level 3: use merged pair logic
      if (this.trainingSetIndex === 2) {
        this.currentSequence = this.generateMergedSequenceFromPair(baseSequenceIndex);
      } else if (this.trainingSetIndex === 1) {
        // Level 2: shuffle the keys randomly
        this.currentSequence = this.shuffleArray(baseSequence);
      } else {
        // Level 1: use forward/reverse randomization
        const useReverse = Math.random() > 0.5;
        this.currentSequence = useReverse ? [...baseSequence].reverse() : baseSequence;
      }
    }
  }

  private attachKeyListener(): void {
    const readyAt = Date.now() + 400;
    this.keydownListener = (e: KeyboardEvent) => {
      if (Date.now() < readyAt) return;
      if (this.trainingComplete || this.showError) return;
      const pressed = e.key.toUpperCase();
      const expected = this.currentSequence[this.currentStep]?.toUpperCase();
      if (pressed === expected) {
        this.currentStep++;
        if (this.currentStep >= this.currentSequence.length) {
          this.roundsCompleted++;
          this.currentStep = 0;
          const totalSequences =
            this.trainingSets[this.trainingSetIndex]?.sequences.length ?? 6;
          if (this.roundsCompleted >= totalSequences) {
            this.trainingComplete = true;
            this.detachKeyListener();
            this.statsService.recordGameCompletion("oxygen", {
              isPerfect: this.wrongPressCount === 0,
              difficulty: this.difficulty,
            });
            this.achievementService.unlockAchievement(`oxygen_lvl${this.difficulty}_complete`);
            if (this.wrongPressCount === 0) {
              this.achievementService.unlockAchievement(`oxygen_lvl${this.difficulty}_perfect`);
            }
          } else {
            this.loadRandomSequence();
          }
        }
      } else if (e.key.length === 1) {
        this.wrongPressCount++;
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
          this.currentStep = 0;
        }, 700);
      }
    };
    document.addEventListener("keydown", this.keydownListener);
  }

  private detachKeyListener(): void {
    if (this.keydownListener) {
      document.removeEventListener("keydown", this.keydownListener);
      this.keydownListener = null;
    }
  }

  ngOnDestroy(): void {
    this.detachKeyListener();
  }
}
